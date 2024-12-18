import { Router } from 'express';
import {getDoctors, createDoctor, deleteDoctor, updateDoctor} from '../controllers/doctors.controller.js'
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';

const router = Router();

router.get('/doctors', getDoctors)
router.post('/doctors', validateSchema(doctorSchema), createDoctor)
router.delete('/doctors/:id', deleteDoctor)
router.put('/doctors/:id', validateSchema(doctorSchema), updateDoctor)

export default router   