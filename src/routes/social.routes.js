import { Router } from 'express';
import passport from 'passport';
import * as sc from '../controllers/socialAuth.controller.js';

const router = Router();

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/redirect', passport.authenticate('discord', { session: false }), sc.discordAuthController);

export default router;