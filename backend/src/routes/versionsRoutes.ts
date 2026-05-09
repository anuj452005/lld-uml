import { Router, Request, Response, NextFunction } from 'express';
import { PersistenceController } from '../controllers/persistenceController.js';

const router = Router();

/**
 * Middleware to extract the Bearer token from the Authorization header.
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  (req as any).token = token;
  next();
};

/**
 * POST /api/v1/versions/:versionId/restore
 *
 * Restore a version to the working snapshot.
 */
router.post('/:versionId/restore', authenticate, async (req: Request, res: Response) => {
  await PersistenceController.restoreVersion(req, res);
});

export default router;
