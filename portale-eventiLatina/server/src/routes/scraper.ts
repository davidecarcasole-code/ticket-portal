import { Router, Request, Response } from 'express';
import { runScraper, scrapeLatinaEvents, searchEventsOnline } from '../scraper/engine';
import db from '../database';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/run', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const count = await runScraper();
    res.json({ message: `Scraping completato. ${count} nuovi eventi trovati.`, count });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante lo scraping' });
  }
});

router.post('/preview', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const events = await scrapeLatinaEvents();
    const existingUrls = new Set(
      (db.prepare('SELECT source_url FROM events WHERE source_url IS NOT NULL').all() as any[])
        .map((r: any) => r.source_url)
    );
    const filtered = events.filter(e => !existingUrls.has(e.source_url));
    res.json({ events: filtered, count: filtered.length });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la preview' });
  }
});

router.post('/search', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ error: 'Inserisci almeno 3 caratteri per la ricerca' });
    }
    const events = await searchEventsOnline(query);
    res.json({ events, count: events.length });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la ricerca web' });
  }
});

router.post('/save-preview', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Formato non valido' });
    }

    const insertStmt = db.prepare(
      "INSERT OR IGNORE INTO events (id, title, description, category_id, date, time, time_period, location, city, province, region, image_url, source_url, source_name, is_auto_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Lazio', ?, ?, ?, 1)"
    );

    let inserted = 0;
    for (const event of events) {
      try {
        insertStmt.run(
          uuidv4(),
          event.title,
          event.description || null,
          event.category_id || 'cat_culture',
          event.date || new Date().toISOString().split('T')[0],
          event.time || null,
          event.time_period || null,
          event.location || null,
          event.city || 'Latina',
          event.province || 'LT',
          event.image_url || null,
          event.source_url || '',
          event.source_name || 'Web'
        );
        inserted++;
      } catch { }
    }
    res.json({ message: `${inserted} eventi salvati`, count: inserted });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

export default router;
