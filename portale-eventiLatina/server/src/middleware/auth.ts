import { Request, Response, NextFunction } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticazione richiesta' });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Accesso negato. Richiesti privilegi amministrativi.' });
  }
  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Accesso negato. Richiesti privilegi Super Admin.' });
  }
  next();
}
