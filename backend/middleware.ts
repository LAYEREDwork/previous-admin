/**
 * Authentication and common middleware
 */

import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Session {
      username?: string;
      userId?: number;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.username) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  next();
}
