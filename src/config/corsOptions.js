process.loadEnvFile();

const allowedOrigins =
    process.env.NODE_ENV === 'production'
        ? [process.env.PRODUCTION_URL]
        : [process.env.FRONTEND_URL];

export const corsOptions = {
    origin: function (origin, callback) {
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