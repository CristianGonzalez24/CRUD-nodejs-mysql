import express from "express";
import helmet from "helmet";
import compression from "compression";
import { limiter } from "./config/rateLimit.js";
import cors from "cors";
import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import { serveStaticFiles } from './config/staticFiles.js';
import authRoutes from "./routes/auth.routes.js";
import doctorsRoutes from "./routes/doctors.routes.js";
import socialAuthRouter from "./config/setupSocialAuth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { PORT } from "./config/config.js";
import logger from "./config/logger.js";
import setupSwagger from "./docs/setupSwagger.js";

process.loadEnvFile();

if (!process.env.NODE_ENV || !PORT) {
 logger.error(
  "Environment variables not configured properly."
 );
 throw new Error(
  "Environment variables not configured properly."
 );
}
const app = express();
setupSwagger(app);

// app.set('trust proxy', true); // only if you're behind a reverse proxy

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression({ level: 6 }));
app.use(limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use((req, res, next) => {
 logger.info(
  `${req.method} ${req.url}`
 );
 next();
});

// Static files
serveStaticFiles(app);

// Routes
app.use("/api", doctorsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", socialAuthRouter);
app.use('/uploads', express.static('uploads'));

// Middleware for errors
app.use(errorHandler);

app.listen(PORT, () =>
 console.log(
  `Server running on port ${PORT}`
 )
);

export default app;
