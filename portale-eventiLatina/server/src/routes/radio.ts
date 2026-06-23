import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import db from '../database';
import { requireAuth, requireSuperAdmin } from '../middleware/auth';

const router = Router();
const UPLOAD_DIR = path.join(__dirname, '../../uploads/radio');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function getSettings() {
  let s = db.prepare('SELECT * FROM radio_settings WHERE id = ?').get('main') as any;
  if (!s) {
    db.prepare('INSERT INTO radio_settings (id, station_name, station_description) VALUES (?, ?, ?)').run(
      'main', 'Radio Eventi Latina', 'La web radio del portale eventiNLatina'
    );
    s = db.prepare('SELECT * FROM radio_settings WHERE id = ?').get('main');
  }
  return s;
}

// GET /api/radio/settings — public
router.get('/settings', (_req: Request, res: Response) => {
  res.json(getSettings());
});

// PUT /api/radio/settings — super admin only
router.put('/settings', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  const { station_name, station_description, stream_url, is_live } = req.body;
  const updates: string[] = ["updated_at = datetime('now')"];
  const params: any[] = [];
  if (station_name !== undefined) { updates.push('station_name = ?'); params.push(station_name); }
  if (station_description !== undefined) { updates.push('station_description = ?'); params.push(station_description); }
  if (stream_url !== undefined) { updates.push('stream_url = ?'); params.push(stream_url); }
  if (is_live !== undefined) { updates.push('is_live = ?'); params.push(is_live ? 1 : 0); }
  params.push('main');
  db.prepare(`UPDATE radio_settings SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  res.json(getSettings());
});

// GET /api/radio/podcasts — public
router.get('/podcasts', (_req: Request, res: Response) => {
  const podcasts = db.prepare('SELECT * FROM radio_podcasts WHERE is_published = 1 ORDER BY created_at DESC').all();
  res.json(podcasts);
});

// GET /api/radio/podcasts/:id — public
router.get('/podcasts/:id', (req: Request, res: Response) => {
  const podcast = db.prepare('SELECT * FROM radio_podcasts WHERE id = ?').get(req.params.id);
  if (!podcast) return res.status(404).json({ error: 'Podcast non trovato' });
  res.json(podcast);
});

// POST /api/radio/podcasts — super admin only (upload podcast)
router.post('/podcasts', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  const { title, description, duration } = req.body;
  if (!title) return res.status(400).json({ error: 'Titolo richiesto' });
  const id = uuidv4();
  db.prepare('INSERT INTO radio_podcasts (id, title, description, file_path, duration, created_by) VALUES (?, ?, ?, ?, ?, ?)').run(
    id, title, description || null, '', duration || 0, req.user!.id
  );
  const podcast = db.prepare('SELECT * FROM radio_podcasts WHERE id = ?').get(id);
  res.json(podcast);
});

// DELETE /api/radio/podcasts/:id — super admin only
router.delete('/podcasts/:id', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  const podcast = db.prepare('SELECT * FROM radio_podcasts WHERE id = ?').get(req.params.id) as any;
  if (!podcast) return res.status(404).json({ error: 'Podcast non trovato' });
  if (podcast.file_path && fs.existsSync(podcast.file_path)) {
    fs.unlinkSync(podcast.file_path);
  }
  db.prepare('DELETE FROM radio_podcasts WHERE id = ?').run(req.params.id);
  res.json({ message: 'Podcast eliminato' });
});

// POST /api/radio/podcasts/:id/upload — super admin only (upload audio file)
router.post('/podcasts/:id/upload', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  const podcast = db.prepare('SELECT * FROM radio_podcasts WHERE id = ?').get(req.params.id) as any;
  if (!podcast) return res.status(404).json({ error: 'Podcast non trovato' });

  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const ext = '.webm';
    const filename = `${req.params.id}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    db.prepare('UPDATE radio_podcasts SET file_path = ?, file_size = ?, file_type = ? WHERE id = ?').run(
      filePath, buffer.length, 'audio/webm', req.params.id
    );
    res.json({ message: 'File caricato', file_path: `/uploads/radio/${filename}`, file_size: buffer.length });
  });
});

// GET /api/radio/uploads/:filename — serve uploaded files
router.get('/uploads/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename as string;
  const filePath = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File non trovato' });
  res.sendFile(filePath);
});

// POST /api/radio/live/start — super admin (start live transmission)
router.post('/live/start', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  db.prepare('UPDATE radio_settings SET is_live = 1, updated_at = datetime(\'now\') WHERE id = ?').run('main');
  // Clear old chunks
  db.prepare('DELETE FROM radio_live_chunks').run();
  res.json({ message: 'Live started' });
});

// POST /api/radio/live/stop — super admin
router.post('/live/stop', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  db.prepare('UPDATE radio_settings SET is_live = 0, updated_at = datetime(\'now\') WHERE id = ?').run('main');
  // Optionally save live as podcast? For now just stop
  res.json({ message: 'Live stopped' });
});

// POST /api/radio/live/chunk — super admin (send audio chunk)
router.post('/live/chunk', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  const { chunk_index } = req.body;
  if (!req.body.chunk_data) return res.status(400).json({ error: 'No chunk data' });

  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    const buf = Buffer.concat(chunks);
    // Store the chunk in the database (base64 encoded)
    // For simplicity, we store the raw data
    const chunkData = buf.toString('base64');
    const existing = db.prepare('SELECT id FROM radio_live_chunks WHERE chunk_index = ?').get(chunk_index || 0);
    if (existing) {
      db.prepare('UPDATE radio_live_chunks SET chunk_data = ? WHERE chunk_index = ?').run(chunkData, chunk_index || 0);
    } else {
      db.prepare('INSERT INTO radio_live_chunks (chunk_data, chunk_index) VALUES (?, ?)').run(chunkData, chunk_index || 0);
    }
    res.json({ message: 'Chunk received', index: chunk_index || 0 });
  });
});

// POST /api/radio/live/chunk-binary — super admin (binary audio chunk via multipart)
router.post('/live/chunk-binary', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    const buf = Buffer.concat(chunks);
    const chunkIndex = parseInt(req.query.index as string || '0');
    const existing = db.prepare('SELECT id FROM radio_live_chunks WHERE chunk_index = ?').get(chunkIndex);
    const chunkData = buf.toString('base64');
    if (existing) {
      db.prepare('UPDATE radio_live_chunks SET chunk_data = ? WHERE chunk_index = ?').run(chunkData, chunkIndex);
    } else {
      db.prepare('INSERT INTO radio_live_chunks (chunk_data, chunk_index) VALUES (?, ?)').run(chunkData, chunkIndex);
    }
    res.json({ message: 'Chunk received', index: chunkIndex, size: buf.length });
  });
});

// GET /api/radio/live/chunks — public (get all live chunks for listeners)
router.get('/live/chunks', (_req: Request, res: Response) => {
  const settings = getSettings();
  if (!settings.is_live) return res.json({ live: false, chunks: [] });

  const chunks = db.prepare('SELECT chunk_index, chunk_data FROM radio_live_chunks ORDER BY chunk_index ASC').all() as any[];
  const decoded = chunks.map((c: any) => ({
    index: c.chunk_index,
    data: c.chunk_data,
  }));
  res.json({ live: true, chunks: decoded });
});

// GET /api/radio/live/status — public
router.get('/live/status', (_req: Request, res: Response) => {
  const settings = getSettings();
  res.json({ is_live: settings.is_live === 1, station_name: settings.station_name });
});

export default router;
