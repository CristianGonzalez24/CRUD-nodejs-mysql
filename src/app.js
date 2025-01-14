import express from 'express'
import helmet from 'helmet';
import compression from "compression";
import cors from 'cors';
import { PORT } from './config/config.js'
import doctorsRoutes from './routes/doctors.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { limiter } from './config/rateLimit.js';
import { corsOptions } from './config/corsOptions.js';

process.loadEnvFile();

if (!process.env.NODE_ENV || !PORT) {
    throw new Error('Environment variables not configured properly.');
}
const app = express();
const noCache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(noCache);
app.use(compression({ level: 6 }));
app.use(limiter);
app.use(cors(corsOptions));

// Routes
app.use('/api', doctorsRoutes);

// Middleware for errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;