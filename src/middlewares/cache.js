import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 300 segundos (5 minutos)

export const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        if (typeof cachedResponse === 'object' && cachedResponse !== null) {
            return res.json(cachedResponse);
        } else {
            cache.del(key);
        }
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
        if (typeof body === 'object' && body !== null) {
            cache.set(key, body);
        }
        return originalJson(body);
    };

    next();
};

export const clearCache = () => {
    cache.flushAll();
};

