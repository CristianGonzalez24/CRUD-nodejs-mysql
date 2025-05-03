import { Router } from 'express';
import passport from 'passport';
import '../strategies/discordStrategy.js';
import socialRoutes from '../routes/social.routes.js';

passport.initialize();

const socialAuthRouter = Router();

socialAuthRouter.use(socialRoutes);

export default socialAuthRouter;