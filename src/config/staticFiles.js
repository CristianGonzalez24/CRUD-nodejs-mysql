import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

process.loadEnvFile();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const origin = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_URL
  : process.env.FRONTEND_URL;

export function serveStaticFiles(app) {
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
        setHeaders: (res, path) => {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
        }        
    }));
}