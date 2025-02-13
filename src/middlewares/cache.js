import logger from "../config/logger.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // 300 segundos (5 minutos)

export const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        logger.info(`Cache hit for key: ${key}`);
        if (typeof cachedResponse === "object" && cachedResponse !== null) {
            return res.json(cachedResponse);
        } else {
            logger.warn(`Invalid cache entry removed for key: ${key}`);
            cache.del(key);
        }
    } else {
        logger.info(`Cache miss for key: ${key}`);
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
        if (typeof body === "object" && body !== null) {
            cache.set(key, body);
            logger.info(`Response cached for key: ${key}`);
        }
        return originalJson(body);
    };

    next();
};

export const clearCache = () => {
    cache.flushAll();
    logger.warn("Cache cleared");
};