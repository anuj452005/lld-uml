import { Router } from 'express';
import { DiagramService } from '../services/diagramService.js';
const router = Router();
/**
 * Middleware to extract the Bearer token from the Authorization header.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
    }
    const token = authHeader.split(' ')[1];
    req.token = token;
    next();
};
// POST /api/v1/diagrams - Create a new diagram
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, sourceType } = req.body;
        if (!name || !sourceType) {
            return res.status(400).json({ success: false, error: 'Name and sourceType are required' });
        }
        const diagram = await DiagramService.createDiagram(req.token, name, sourceType);
        res.status(201).json({ success: true, data: { diagramId: diagram.id } });
    }
    catch (error) {
        console.error('Error creating diagram:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/v1/diagrams - List diagrams
router.get('/', authenticate, async (req, res) => {
    try {
        const diagrams = await DiagramService.listDiagrams(req.token);
        res.status(200).json({ success: true, data: { diagrams } });
    }
    catch (error) {
        console.error('Error listing diagrams:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// GET /api/v1/diagrams/:id - Get single diagram
router.get('/:id', authenticate, async (req, res) => {
    try {
        const diagram = await DiagramService.getDiagram(req.token, req.params.id);
        res.status(200).json({ success: true, data: { diagram } });
    }
    catch (error) {
        console.error('Error fetching diagram:', error);
        res.status(error.message === 'Unauthorized' ? 401 : 404).json({ success: false, error: error.message });
    }
});
export default router;
