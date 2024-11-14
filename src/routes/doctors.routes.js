import { Router } from 'express';
import {getDoctors, createDoctor} from '../controllers/doctors.controller.js'
import { validateSchema } from '../middleware/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';

const router = Router();

router.get('/doctors', getDoctors)
router.post('/doctors', validateSchema(doctorSchema), createDoctor)

export default router   