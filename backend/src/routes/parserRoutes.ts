import { Router, Request, Response, NextFunction } from 'express';

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

// POST /api/v1/parser/java - Parse Java source and generate UML
router.post('/java', authenticate, async (req: Request, res: Response) => {
  const { source } = req.body;

  if (!source) {
    return res.status(400).json({
      success: false,
      error: 'Missing source code',
    });
  }

  if (source.length > 1024 * 1024) {
    return res.status(413).json({
      success: false,
      error: 'Payload too large (max 1MB)',
    });
  }

  // TODO: Proxy to actual Java Parser service (Unit 10)
  // For Unit 9, we return a stub success response
  res.status(200).json({
    success: true,
    data: {
      success: true,
      diagram: null, // UI will handle null diagram with "success:true" as a partial or stub state
      warnings: [
        {
          code: 'PARSER_STUB',
          message: 'The Java Parser service is currently in stub mode. Actual parsing will be enabled in Unit 10.',
        },
      ],
      errors: [],
    },
  });
});

export default router;
