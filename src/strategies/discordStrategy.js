import passport from 'passport';
import { Strategy } from 'passport-discord';
import { socialLogin } from '../config/passport.js';
import { discordProfileSchema } from '../validators/socialProfiles.schema.js';
import logger from '../config/logger.js';

passport.use('discord', new Strategy({ 
    clientID: socialLogin.discord.clientID, 
    clientSecret: socialLogin.discord.clientSecret, 
    callbackURL: socialLogin.discord.callbackURL, 
    scope: socialLogin.discord.scope
}, async (accessToken, refreshToken, profile, done) => {
    try { 
        logger.info('Validating Discord profile');

        const validatedProfile = discordProfileSchema.parse({
            id: profile.id,
            username: profile.username,
            global_name: profile.global_name ?? null,
            email: profile.email ?? null,
            discriminator: profile.discriminator,
            avatar: profile.avatar
        });

        logger.info('Discord profile validated successfully'); 

        return done(null, validatedProfile); 
    } catch (error) {
        logger.error(`Error validating Discord profile: ${error.message}`);
        return done(error, null);
    }
}));