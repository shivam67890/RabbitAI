import { Router } from 'express';
import multer from 'multer';
import { processSalesData } from './controller.js';

const router = Router();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
});

/**
 * @openapi
 * /api/summarize:
 *   post:
 *     summary: Upload sales data and email a summary
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Summary generated and dispatched successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/summarize', upload.single('file'), processSalesData);

export default router;