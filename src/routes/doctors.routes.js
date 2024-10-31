import { Router } from 'express';
import {getDoctors} from '../controllers/doctors.controller.js'

const router = Router();

router.get('/', getDoctors)

export default router   