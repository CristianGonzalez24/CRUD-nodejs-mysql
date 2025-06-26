import { Router } from 'express';
import * as dc from '../controllers/doctors.controller.js'
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';
import { cacheMiddleware, clearCache } from '../middlewares/cache.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/verifyAdmin.js';


const router = Router();

router.get('/doctors', cacheMiddleware, dc.getDoctors);
router.get('/doctors/specialties', cacheMiddleware, dc.getSpecialties);
router.get('/doctors/all', cacheMiddleware, dc.getAllDoctors);
router.get('/doctors/:id', cacheMiddleware, dc.getDoctorById);

router.post('/doctors', verifyToken, isAdmin, validateSchema(doctorSchema), (req, res, next) => {
    clearCache();
    dc.createDoctor(req, res, next);
});

router.put('/doctors/:id', verifyToken, isAdmin, validateSchema(doctorSchema), (req, res, next) => { 
    clearCache();
    dc.updateDoctor(req, res, next);
});

router.delete('/doctors/:id', verifyToken, isAdmin, (req, res, next) => {
    clearCache();
    dc.deleteDoctor(req, res, next);
});

router.patch('/doctors/:id/deactivate', verifyToken, isAdmin, (req, res, next) => {
    clearCache();
    dc.deactivateDoctor(req, res, next);
});

router.patch('/doctors/:id/activate', verifyToken, isAdmin, (req, res, next) => {
    clearCache();
    dc.activateDoctor(req, res, next);
});

export default router;