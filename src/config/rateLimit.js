import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests. Try again later.',
            retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000),
        });
    },
});