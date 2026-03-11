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

/* Security headers (helmet = security middleware) */
app.use(helmet());

/* CORS configuration */
const allowedOrigins = [
  "http://localhost:3000",
  "https://rabbit-ai-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["POST", "GET"],
  credentials: true
}));

/* Rate limiter */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.'
});

/* Health check route */
app.get('/', (req, res) => {
  res.send('RabbitAI backend running');
});

/* JSON parser */
app.use(express.json());

/* Apply rate limit to API */
app.use('/api', limiter);

/* API routes */
app.use('/api', apiRoutes);

/* Swagger docs */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/* Start server */
app.listen(PORT, () => {
  console.log(`Secure backend operational on port ${PORT}`);
});