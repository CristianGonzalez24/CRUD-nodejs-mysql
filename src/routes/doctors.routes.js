import { Router } from 'express';
import * as dc from '../controllers/doctors.controller.js'
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';
import { cacheMiddleware, clearCache } from '../middlewares/cache.js';

const router = Router();

router.get('/doctors', cacheMiddleware, dc.getDoctors);
router.get('/doctors/all', cacheMiddleware, dc.getAllDoctors);
router.get('/doctors/:id', cacheMiddleware, dc.getDoctorById);

router.post('/doctors', validateSchema(doctorSchema), (req, res, next) => {
    clearCache();
    dc.createDoctor(req, res, next);
});

router.put('/doctors/:id', validateSchema(doctorSchema), (req, res, next) => {
    clearCache();
    dc.updateDoctor(req, res, next);
});

router.delete('/doctors/:id', (req, res, next) => {
    clearCache();
    dc.deleteDoctor(req, res, next);
});

router.patch('/doctors/:id/deactivate', (req, res, next) => {
    clearCache();
    dc.deactivateDoctor(req, res, next);
});

router.patch('/doctors/:id/activate', (req, res, next) => {
    clearCache();
    dc.activateDoctor(req, res, next);
});

export default router;