import { Router } from 'express';
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';
import * as dc from '../controllers/doctors.controller.js'

const router = Router();

router.get('/doctors', dc.getDoctors);
router.get('/doctors/all', dc.getAllDoctors);

router.post('/doctors', validateSchema(doctorSchema), dc.createDoctor);

router.put('/doctors/:id', validateSchema(doctorSchema), dc.updateDoctor);
router.delete('/doctors/:id', dc.deleteDoctor);

router.patch('/doctors/:id/deactivate', dc.deactivateDoctor);
router.patch('/doctors/:id/activate', dc.activateDoctor);

export default router;
