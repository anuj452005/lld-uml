import { Router, Request, Response, NextFunction } from 'express';
import { DiagramService } from '../services/diagramService.js';
import { PersistenceController } from '../controllers/persistenceController.js';
import {
  CreateDiagramPayloadSchema,
  UpdateDiagramPayloadSchema,
  validateClassName,
  validateField,
  validateMethodSignature,
  validateRelationship,
} from '../lib/validation/index.js';
import type { UMLDiagram } from '../types/uml.js';

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

// POST /api/v1/diagrams - Create a new diagram
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const result = CreateDiagramPayloadSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: result.error.issues 
      });
    }

    const { name, sourceType } = result.data;
    const diagram = await DiagramService.createDiagram((req as any).token, name, sourceType);
    res.status(201).json({ success: true, data: { diagramId: diagram.id } });
  } catch (error: any) {
    console.error('Error creating diagram:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/diagrams - List diagrams
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const diagrams = await DiagramService.listDiagrams((req as any).token);
    res.status(200).json({ success: true, data: { diagrams } });
  } catch (error: any) {
    console.error('Error listing diagrams:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/v1/diagrams/:id - Get single diagram
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const diagram = await DiagramService.getDiagram((req as any).token, req.params.id as string);
    res.status(200).json({ success: true, data: { diagram } });
  } catch (error: any) {
    console.error('Error fetching diagram:', error);
    res.status(error.message === 'Unauthorized' ? 401 : 404).json({ success: false, error: error.message });
  }
});

// PATCH /api/v1/diagrams/:id - Update diagram structure
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const result = UpdateDiagramPayloadSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: result.error.issues 
      });
    }

    const semanticError = validateDiagramSemantic(result.data.diagram as UMLDiagram);
    if (semanticError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: [{ message: semanticError }],
      });
    }

    await DiagramService.updateDiagram((req as any).token, req.params.id as string, result.data);
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error updating diagram:', error);
    res.status(error.message === 'Unauthorized' ? 401 : 500).json({ success: false, error: error.message });
  }
});

function validateDiagramSemantic(diagram: UMLDiagram): string | null {
  const entityNames = [
    ...diagram.classes.map((cls) => cls.name),
    ...diagram.interfaces.map((intf) => intf.name),
  ];

  for (const cls of diagram.classes) {
    const classNameValidation = validateClassName(
      cls.name,
      entityNames.filter((name: string) => name !== cls.name)
    );

    if (!classNameValidation.valid) {
      return classNameValidation.error ?? 'Invalid class name';
    }

    for (const field of cls.fields) {
      const fieldValidation = validateField(field);
      if (!fieldValidation.valid) {
        return fieldValidation.error ?? 'Invalid field';
      }
    }

    for (const method of cls.methods) {
      const methodValidation = validateMethodSignature(method.signature);
      if (!methodValidation.valid) {
        return methodValidation.error ?? 'Invalid method signature';
      }
    }
  }

  for (const intf of diagram.interfaces) {
    const interfaceNameValidation = validateClassName(
      intf.name,
      entityNames.filter((name: string) => name !== intf.name)
    );

    if (!interfaceNameValidation.valid) {
      return interfaceNameValidation.error ?? 'Invalid interface name';
    }

    for (const method of intf.methods) {
      const methodValidation = validateMethodSignature(method.signature);
      if (!methodValidation.valid) {
        return methodValidation.error ?? 'Invalid method signature';
      }
    }
  }

  for (const relationship of diagram.relationships) {
    const relationshipValidation = validateRelationship(relationship, diagram);
    if (!relationshipValidation.valid) {
      return relationshipValidation.error ?? 'Invalid relationship';
    }
  }

  return null;
}

// PUT /api/v1/diagrams/:id - Save working snapshot (auto-save)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  await PersistenceController.saveWorkingSnapshot(req, res);
});

// POST /api/v1/diagrams/:id/versions - Create a new version
router.post('/:id/versions', authenticate, async (req: Request, res: Response) => {
  await PersistenceController.createVersion(req, res);
});

// GET /api/v1/diagrams/:id/versions - List versions
router.get('/:id/versions', authenticate, async (req: Request, res: Response) => {
  await PersistenceController.listVersions(req, res);
});

export default router;
