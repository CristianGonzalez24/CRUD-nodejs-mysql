import { Router } from 'express';
import {getDoctors, getAllDoctors, createDoctor, deactivateDoctor, activateDoctor, updateDoctor, deleteDoctor} from '../controllers/doctors.controller.js'
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';

const router = Router();

router.route('/doctors').get(getDoctors).post(validateSchema(doctorSchema), createDoctor);
router.route('/doctors/all').get(getAllDoctors);
router.route('/doctors/:id')
    .put(validateSchema(doctorSchema), updateDoctor)
    .delete(deleteDoctor)
    .patch(deactivateDoctor)
    .patch(activateDoctor);

export default router;
