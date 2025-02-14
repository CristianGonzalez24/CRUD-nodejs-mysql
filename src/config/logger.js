import winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

const combinedTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,  
    maxSize: '10m',       // Máximo 10MB por archivo antes de rotar
    maxFiles: '14d',      
    level: 'info',
});

const errorTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,  
    maxSize: '5m',
    maxFiles: '30d',      // Mantener logs de errores por 30 días
    level: 'error',
});

const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        logFormat
    )
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    transports: [combinedTransport, errorTransport, consoleTransport],
});

export default logger;
