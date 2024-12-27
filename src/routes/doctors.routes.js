import { Router } from 'express';
import {getDoctors, getAllDoctors, createDoctor, deactivateDoctor, activateDoctor, updateDoctor, deleteDoctor} from '../controllers/doctors.controller.js'
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';

const router = Router();

router.get('/doctors', getDoctors)
router.get('/doctors/all', getAllDoctors)
router.post('/doctors', validateSchema(doctorSchema), createDoctor)
router.put('/doctors/:id', validateSchema(doctorSchema), updateDoctor)
router.delete('/doctors/:id', deleteDoctor)
router.patch('/doctors/:id/deactivate', deactivateDoctor)
router.patch('/doctors/:id/activate', activateDoctor)

export default router;