import express from 'express'
import helmet from 'helmet';
import compression from "compression";
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { PORT } from './config/config.js'
import doctorsRoutes from './routes/doctors.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';

// Node Bcrypt
process.loadEnvFile();

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests. Try again after some time.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000),
        });
    },
});

const allowedOrigins =
    process.env.NODE_ENV === 'production'
        ? [process.env.PRODUCTION_URL] 
        : [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

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
app.use('/api', doctorsRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log('Server on port', PORT));