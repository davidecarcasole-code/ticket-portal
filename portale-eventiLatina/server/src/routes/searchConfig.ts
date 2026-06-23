import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requireAdmin, (_req: Request, res: Response) => {
  try {
    const config = db.prepare('SELECT * FROM search_config ORDER BY id LIMIT 1').get();
    const sources = db.prepare('SELECT * FROM scraped_sources ORDER BY province, name').all();
    res.json({ config, sources });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel caricamento configurazione' });
  }
});

router.put('/', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const { id, name, cities, provinces, categories, keywords, radius_km, auto_scrape, scrape_interval_hours } = req.body;
    if (!id) return res.status(400).json({ error: 'ID configurazione mancante' });

    db.prepare(
      "UPDATE search_config SET name = COALESCE(?, name), cities = COALESCE(?, cities), provinces = COALESCE(?, provinces), categories = COALESCE(?, categories), keywords = COALESCE(?, keywords), radius_km = COALESCE(?, radius_km), auto_scrape = COALESCE(?, auto_scrape), scrape_interval_hours = COALESCE(?, scrape_interval_hours), updated_at = datetime('now') WHERE id = ?"
    ).run(
      name || null,
      cities ? JSON.stringify(cities) : null,
      provinces ? JSON.stringify(provinces) : null,
      categories ? JSON.stringify(categories) : null,
      keywords ? JSON.stringify(keywords) : null,
      radius_km ?? null,
      auto_scrape ?? null,
      scrape_interval_hours ?? null,
      id
    );
    const config = db.prepare('SELECT * FROM search_config WHERE id = ?').get(id);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento configurazione" });
  }
});

router.put('/source/:id', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const { is_active, name, url, type, selectors, city, province, category_id } = req.body;
    db.prepare(
      "UPDATE scraped_sources SET is_active = COALESCE(?, is_active), name = COALESCE(?, name), url = COALESCE(?, url), type = COALESCE(?, type), selectors = COALESCE(?, selectors), city = COALESCE(?, city), province = COALESCE(?, province), category_id = COALESCE(?, category_id) WHERE id = ?"
    ).run(
      is_active ?? null, name || null, url || null, type || null,
      selectors ? JSON.stringify(selectors) : null, city || null, province || null, category_id || null,
      req.params.id
    );
    const source = db.prepare('SELECT * FROM scraped_sources WHERE id = ?').get(req.params.id);
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento fonte" });
  }
});

router.post('/source', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, url, type, selectors, city, province, category_id } = req.body;
    if (!name || !url) return res.status(400).json({ error: 'Nome e URL obbligatori' });
    const id = `src_${uuidv4().slice(0, 8)}`;
    db.prepare(
      'INSERT INTO scraped_sources (id, name, url, type, is_active, selectors, city, province, category_id) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)'
    ).run(id, name, url, type || 'html', selectors ? JSON.stringify(selectors) : null, city || null, province || 'LT', category_id || null);
    const source = db.prepare('SELECT * FROM scraped_sources WHERE id = ?').get(id);
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione fonte' });
  }
});

router.delete('/source/:id', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM scraped_sources WHERE id = ?').run(req.params.id);
    res.json({ message: 'Fonte eliminata' });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione fonte" });
  }
});

export default router;
