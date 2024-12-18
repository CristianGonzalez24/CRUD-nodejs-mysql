import express from 'express'
import { PORT } from './config.js'
import doctorsRoutes from './routes/doctors.routes.js'
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api', doctorsRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log('Server on port', PORT))