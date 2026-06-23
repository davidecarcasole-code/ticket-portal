import { Router, Request, Response } from 'express';
import db from '../database';
import { requireAuth, requireSuperAdmin } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, (req: Request, res: Response) => {
  try {
    const user = db.prepare('SELECT id, email, name, avatar, role, theme, accent_color, created_at FROM users WHERE id = ?').get(req.user!.id);
    if (!user) return res.status(404).json({ error: 'Utente non trovato' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel caricamento profilo' });
  }
});

router.put('/me', requireAuth, (req: Request, res: Response) => {
  try {
    const { name, avatar, theme, accent_color } = req.body;
    db.prepare(
      'UPDATE users SET name = COALESCE(?, name), avatar = COALESCE(?, avatar), theme = COALESCE(?, theme), accent_color = COALESCE(?, accent_color), updated_at = datetime(\'now\') WHERE id = ?'
    ).run(name, avatar, theme, accent_color, req.user!.id);
    const user = db.prepare('SELECT id, email, name, avatar, role, theme, accent_color FROM users WHERE id = ?').get(req.user!.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento profilo' });
  }
});

router.get('/', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  try {
    const users = db.prepare('SELECT id, email, name, avatar, role, theme, created_at FROM users ORDER BY created_at DESC').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel caricamento utenti' });
  }
});

router.put('/:id/role', requireAuth, requireSuperAdmin, (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ error: 'Ruolo non valido' });
    }
    db.prepare('UPDATE users SET role = ?, updated_at = datetime(\'now\') WHERE id = ?').run(role, req.params.id);
    res.json({ message: 'Ruolo aggiornato' });
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento ruolo' });
  }
});

export default router;
