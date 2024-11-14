import express from 'express'
import morgan from 'morgan';
import { PORT } from './config.js'
import doctorsRoutes from './routes/doctors.routes.js'

const app = express();

app.use(morgan('dev'));
app.use('/api', doctorsRoutes);

app.listen(PORT, () => console.log('Server on port', PORT))