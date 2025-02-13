import express from 'express'
import helmet from 'helmet';
import compression from "compression";
import { limiter } from './config/rateLimit.js';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.js';
import doctorsRoutes from './routes/doctors.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { PORT } from './config/config.js';
import logger from './config/logger.js';

process.loadEnvFile();

if (!process.env.NODE_ENV || !PORT) {
    throw new Error('Environment variables not configured properly.');
}
const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression({ level: 6 }));
app.use(limiter);
app.use(cors(corsOptions));
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api', doctorsRoutes);

// Middleware for errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;