/**
 * Authentication and common middleware
 */

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    username?: string;
    userId?: number;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.username) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  next();
}
