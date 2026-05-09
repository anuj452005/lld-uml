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

  try {
    const parserUrl = process.env.JAVA_PARSER_URL || 'http://localhost:8080';
    console.log(`Forwarding parse request to ${parserUrl}/parse`);

    const response = await fetch(`${parserUrl}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source }),
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `Parser service error: ${errorText}`,
      });
    }

    const result = await response.json();
    res.status(200).json({
      success: true,
      data: {
        success: result.success,
        ...result.data,
      },
    });
  } catch (error: any) {
    console.error('Error proxying to Java parser:', error);
    
    if (error.name === 'TimeoutError') {
      return res.status(504).json({
        success: false,
        error: 'Parser service timed out (15s)',
      });
    }

    res.status(502).json({
      success: false,
      error: 'Failed to connect to parser service. Is it running?',
    });
  }
});

export default router;
