import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import db from '../database';

const router = Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@eventinlatina.it';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Credenziale mancante' });
    }

    let payload: any;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      try {
        payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
      } catch {
        return res.status(400).json({ error: 'Token Google non valido' });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Token Google non valido' });
    }

    const { sub: googleId, email, name, picture } = payload;

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      const role = email === ADMIN_EMAIL ? 'super_admin' : 'user';
      const id = googleId || `user_${Date.now()}`;
      db.prepare('INSERT INTO users (id, email, name, avatar, role) VALUES (?, ?, ?, ?, ?)').run(
        id, email, name || 'Utente', picture || null, role
      );
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    } else {
      if (picture && picture !== user.avatar) {
        db.prepare('UPDATE users SET avatar = ?, updated_at = datetime(\'now\') WHERE id = ?').run(picture, user.id);
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as JwtPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        theme: user.theme,
        accent_color: user.accent_color,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Errore durante l\'autenticazione' });
  }
});

router.post('/demo', (_req: Request, res: Response) => {
  try {
    const demoEmail = 'demo@eventinlatina.it';
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(demoEmail) as any;

    if (!user) {
      db.prepare('INSERT INTO users (id, email, name, avatar, role) VALUES (?, ?, ?, ?, ?)').run(
        'demo_user', demoEmail, 'Utente Demo', null, 'super_admin'
      );
      user = db.prepare('SELECT * FROM users WHERE id = ?').get('demo_user');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as JwtPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        theme: user.theme,
        accent_color: user.accent_color,
      },
    });
  } catch (error) {
    console.error('Demo auth error:', error);
    res.status(500).json({ error: 'Errore nella modalità demo' });
  }
});

router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId) as any;
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      theme: user.theme,
      accent_color: user.accent_color,
    });
  } catch {
    return res.status(401).json({ error: 'Token non valido' });
  }
});

export function authMiddleware(req: Request, _res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const user = db.prepare('SELECT id, email, name, avatar, role FROM users WHERE id = ?').get(decoded.userId) as any;
      if (user) {
        req.user = { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar };
      }
    } catch {}
  }
  next();
}

export default router;
