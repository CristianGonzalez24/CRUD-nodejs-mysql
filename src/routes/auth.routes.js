import { Router } from 'express';
import { upload } from '../config/multer.js';
import { validateSchema } from '../middlewares/middleware.js';
import { isAdmin } from "../middlewares/verifyAdmin.js"; 
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyUserId } from '../middlewares/verifyUserId.js';
import { registerSchema, loginSchema, toggleUserSchema, updateUserSchema, passwordSchema } from '../validators/auth.schema.js';
import * as ac from '../controllers/auth.controller.js';

const router = Router();

router.get('/me', verifyToken, ac.getProfile);
router.get('/users', verifyToken, isAdmin, ac.getAllUsers);
router.get('/has-refresh-token', ac.hasRefreshToken);

router.post('/refresh', ac.refreshAccessToken);
router.post('/register', validateSchema(registerSchema), ac.registerUser);
router.post('/admin/register', verifyToken, isAdmin, validateSchema(registerSchema), ac.registerUser);
router.post('/login', validateSchema(loginSchema), ac.loginUser);
router.post('/logout', ac.logoutUser);
router.post('/:id/upload-image', verifyToken, verifyUserId, upload.single('avatar'), ac.uploadImage);

router.patch('/users/:id', verifyToken, verifyUserId, validateSchema(updateUserSchema), ac.updateUser);
router.patch('/users/:id/activate', verifyToken, isAdmin, validateSchema(toggleUserSchema), ac.toggleUserStatus);
router.patch('/users/:id/password', verifyToken, verifyUserId, validateSchema(passwordSchema), ac.updateUserPassword);

router.delete('/users/:id', verifyToken, isAdmin, ac.deleteUser);
router.delete('/:id/remove-image', verifyToken, verifyUserId, ac.removeProfilePicture);

export default router;