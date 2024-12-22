import { Router } from 'express';
import {getDoctors, getAllDoctors, createDoctor, deactivateDoctor, activateDoctor, updateDoctor} from '../controllers/doctors.controller.js'
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';

const router = Router();

router.get('/doctors', getDoctors)
router.get('/doctors/all', getAllDoctors)
router.post('/doctors', validateSchema(doctorSchema), createDoctor)
router.delete('/doctors/:id', deactivateDoctor)
router.patch('/doctors/:id/activate', activateDoctor)
router.put('/doctors/:id', validateSchema(doctorSchema), updateDoctor)

export default router;