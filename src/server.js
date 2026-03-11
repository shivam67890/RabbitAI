import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRoutes from './routes.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['POST']
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.'
});

app.use('/api', limiter);

app.use(express.json());

app.use('/api', apiRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Secure backend operational on port ${PORT}`);
});