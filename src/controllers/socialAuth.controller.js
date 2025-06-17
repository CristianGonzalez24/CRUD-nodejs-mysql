import * as sm from '../models/socialAuth.model.js';
import { getUserByEmail, getUserById } from '../models/auth.model.js';
import { generateTokens } from '../utils/jwt.js';
import logger from '../config/logger.js';
import ms from 'ms';

process.loadEnvFile();

export const discordAuthController = async (req, res, next) => {
    const profile = req.user;

    const avatarUrl = profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${profile.discriminator % 5}.png`;

        const isProduction = process.env.NODE_ENV === "production";
        const accessTokenMaxAge = ms(process.env.JWT_EXPIRES_IN) || 15 * 60 * 1000;
        const refreshTokenMaxAge = ms(process.env.REFRESH_TOKEN_EXPIRES_IN) || 7 * 24 * 60 * 60 * 1000; 

    try {
        logger.info(`Processing Discord authentication for: ${profile.email}`);

        const existingSocialAccount = await sm.findSocialAccount('discord', profile.id);

        const redirectUrl = isProduction ? process.env.PRODUCTION_URL : process.env.FRONTEND_URL;

        if (existingSocialAccount) {
            const user = await getUserById(existingSocialAccount.user_id);
        
            if (!user || !user.is_active) {
                logger.warn(`User account is inactive or not found: ${existingSocialAccount.user_id}`);

                const errorParams = new URLSearchParams({
                    error: 'Account is inactive. Please contact support.'
                });

                return res.redirect(`${redirectUrl}?${errorParams.toString()}`);
            }
        
            await sm.updateLastLogin(user.id);
        
            const { accessToken, refreshToken } = await generateTokens(user);
        
            logger.info(`Existing social account found for Discord user: ${user.id}`);
    
            return res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: "Strict",
                maxAge: refreshTokenMaxAge
            })
            .cookie("accessToken", accessToken, {
                httpOnly: false,
                secure: isProduction,
                sameSite: "Strict",
                maxAge: accessTokenMaxAge
            })
            .redirect(redirectUrl);
        }

        logger.info(`No existing social account found for Discord user: ${profile.id}`);

        let user = await getUserByEmail(profile.email, { updateLastLogin: true });

        if (!user) {
            user = await sm.createUser({
                username: profile.global_name,
                email: profile.email,
                is_active: true
            });
            logger.info(`New user created for Discord user: ${user.id}`);
        
            await sm.updateLastLogin(user.id);
        }

        const new_social_account = await sm.createDiscordAccount({
            user_id: user.id,
            provider: 'discord',
            provider_user_id: profile.id,
            email: profile.email,
            username: profile.username,
            global_name: profile.global_name,
            avatar: avatarUrl,
            discriminator: profile.discriminator
        });

        const { accessToken, refreshToken } = await generateTokens(user);

        logger.info(`Social account created and token generated for Discord user: ${user.id}`);

        return res
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "Strict",
            maxAge: refreshTokenMaxAge
        })
        .cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: isProduction,
            sameSite: "Strict",
            maxAge: accessTokenMaxAge
        })
        .redirect(redirectUrl);

    } catch (error) {
        logger.error(`Error processing Discord authentication: ${error.message}`);
        return next(error);
    }
}
