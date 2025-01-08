import express from 'express'
import helmet from 'helmet';
import compression from "compression";
import cors from 'cors';
import { PORT } from './config/config.js'
import doctorsRoutes from './routes/doctors.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';

process.loadEnvFile();

if (!process.env.NODE_ENV || !PORT) {
    throw new Error('Environment variables not configured properly.');
}
const app = express();

import { limiter } from './config/rateLimit.js';

import { corsOptions } from './config/corsOptions.js';

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(
    compression({
        threshold: 1024,
        level: 6,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) return false;
            return compression.filter(req, res);
        },
    })
);
app.use(limiter);
app.use(cors(corsOptions));

// Routes
app.use('/api', doctorsRoutes);

// Middleware for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Middleware for errors
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;