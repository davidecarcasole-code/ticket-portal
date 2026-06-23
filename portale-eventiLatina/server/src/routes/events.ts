import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

function buildEventQuery(params: {
  category?: string;
  province?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}) {
  const { page = 1, limit = 20 } = params;
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));
  const offset = (pageNum - 1) * limitNum;

  const whereClauses: string[] = ['e.is_published = 1'];
  const queryParams: any[] = [];

  if (params.category) {
    whereClauses.push('c.slug = ?');
    queryParams.push(params.category);
  }
  if (params.dateFrom) {
    whereClauses.push('e.date >= ?');
    queryParams.push(params.dateFrom);
  }
  if (params.dateTo) {
    whereClauses.push('e.date <= ?');
    queryParams.push(params.dateTo);
  }
  if (params.province) {
    whereClauses.push('e.province = ?');
    queryParams.push(params.province);
  }
  if (params.city) {
    whereClauses.push('e.city LIKE ?');
    queryParams.push(`%${params.city}%`);
  }
  if (params.search) {
    whereClauses.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)');
    const s = `%${params.search}%`;
    queryParams.push(s, s, s);
  }

  const where = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const baseFrom = 'FROM events e JOIN categories c ON e.category_id = c.id';

  const countSql = `SELECT COUNT(*) as total ${baseFrom} ${where}`;
  const dataSql = `SELECT e.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.color as category_color ${baseFrom} ${where} ORDER BY e.date ASC, e.time ASC LIMIT ? OFFSET ?`;

  return { countSql, dataSql, queryParams, limit: limitNum, offset, pageNum };
}

router.get('/', (req: Request, res: Response) => {
  try {
    const { category, province, dateFrom, dateTo, search, city, page, limit } = req.query;

    const q = buildEventQuery({
      category: category as string,
      province: province as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      search: search as string,
      city: city as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });

    const total = (db.prepare(q.countSql).get(...q.queryParams) as any)?.total || 0;
    const events = db.prepare(q.dataSql).all(...q.queryParams, q.limit, q.offset);

    res.json({
      events,
      pagination: {
        page: q.pageNum,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    });
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({ error: 'Errore nel caricamento eventi' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const event = db.prepare(
      'SELECT e.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.color as category_color FROM events e JOIN categories c ON e.category_id = c.id WHERE e.id = ?'
    ).get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Evento non trovato' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel caricamento evento' });
  }
});

router.post('/', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, description, category_id, date, end_date, time, location, address, city, province, image_url, source_url, source_name } = req.body;

    if (!title || !category_id || !date) {
      return res.status(400).json({ error: 'Titolo, categoria e data sono obbligatori' });
    }

    const id = uuidv4();
    db.prepare(
      'INSERT INTO events (id, title, description, category_id, date, end_date, time, location, address, city, province, image_url, source_url, source_name, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(id, title, description, category_id, date, end_date || null, time || null, location || null, address || null, city || 'Latina', province || 'LT', image_url || null, source_url || null, source_name || null, req.user?.id || null);

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    res.status(201).json(event);
  } catch (error) {
    console.error('Event create error:', error);
    res.status(500).json({ error: 'Errore nella creazione evento' });
  }
});

router.put('/:id', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Evento non trovato' });

    const { title, description, category_id, date, end_date, time, location, address, city, province, image_url, source_url, source_name, is_published } = req.body;

    db.prepare(
      "UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description), category_id = COALESCE(?, category_id), date = COALESCE(?, date), end_date = COALESCE(?, end_date), time = COALESCE(?, time), location = COALESCE(?, location), address = COALESCE(?, address), city = COALESCE(?, city), province = COALESCE(?, province), image_url = COALESCE(?, image_url), source_url = COALESCE(?, source_url), source_name = COALESCE(?, source_name), is_published = COALESCE(?, is_published), updated_at = datetime('now') WHERE id = ?"
    ).run(title, description, category_id, date, end_date, time, location, address, city, province, image_url, source_url, source_name, is_published, req.params.id);

    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento evento" });
  }
});

router.delete('/:id', requireAuth, requireAdmin, (req: Request, res: Response) => {
  try {
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Evento non trovato' });
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.json({ message: 'Evento eliminato' });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione evento" });
  }
});

router.post('/:id/save', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('INSERT OR IGNORE INTO saved_events (user_id, event_id) VALUES (?, ?)').run(req.user!.id, req.params.id);
    res.json({ message: 'Evento salvato' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

router.delete('/:id/save', requireAuth, (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM saved_events WHERE user_id = ? AND event_id = ?').run(req.user!.id, req.params.id);
    res.json({ message: 'Evento rimosso dai salvati' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nella rimozione' });
  }
});

router.get('/saved/mine', requireAuth, (req: Request, res: Response) => {
  try {
    const events = db.prepare(
      'SELECT e.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon, c.color as category_color FROM saved_events s JOIN events e ON s.event_id = e.id JOIN categories c ON e.category_id = c.id WHERE s.user_id = ? ORDER BY e.date ASC'
    ).all(req.user!.id);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel caricamento' });
  }
});

export default router;
