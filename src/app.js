import express from 'express'
import compression from "compression";
import { PORT } from './config/config.js'
import doctorsRoutes from './routes/doctors.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(compression());
app.use(express.json());
app.use('/api', doctorsRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log('Server on port', PORT))