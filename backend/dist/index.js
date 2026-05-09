import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import diagramRoutes from './routes/diagramRoutes.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/v1/diagrams', diagramRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
