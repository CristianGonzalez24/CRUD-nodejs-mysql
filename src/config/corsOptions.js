import { loadEnvFile } from 'node:process';

loadEnvFile();

const allowedOrigins =
    process.env.NODE_ENV === 'production'
        ? [process.env.PRODUCTION_URL]
        : [process.env.FRONTEND_URL];

export const corsOptions = {
    origin: function (origin, callback) {
        console.log("Origin:", origin); // Depuración

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};