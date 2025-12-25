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
  console.log('requireAuth check - username:', req.session?.username, 'userId:', req.session?.userId);
  if (!req.session?.username || !req.session?.userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  next();
}
