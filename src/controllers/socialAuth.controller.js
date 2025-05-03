import * as sm from '../models/socialAuth.model.js';
import { getUserByEmail } from '../models/auth.model.js';
import { generateToken } from '../utils/jwt.js';
import logger from '../config/logger.js';

process.loadEnvFile();

export const discordAuthController = async (req, res) => {
    const profile = req.user;

    const avatarUrl = profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${profile.discriminator % 5}.png`;

        const isProduction = process.env.NODE_ENV === "production";

    try {
        logger.info(`Processing Discord authentication for: ${profile.email}`);

        const existingSocialAccount = await sm.findSocialAccount('discord', profile.id);

        if (existingSocialAccount) {
            const token = generateToken({
                id: existingSocialAccount.user_id,
                username: existingSocialAccount.username,
                email: existingSocialAccount.email
            });
            logger.info(`Existing social account found for Discord user: ${existingSocialAccount.user_id}`);

            const redirectUrl = isProduction ? process.env.PRODUCTION_URL : process.env.FRONTEND_URL;

            const queryParams = new URLSearchParams({
                avatar: existingSocialAccount.avatar
            });

            return res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'strict'
            })
            .redirect(`${redirectUrl}?${queryParams.toString()}`);
        }

        logger.info(`No existing social account found for Discord user: ${profile.id}`);

        let user = await getUserByEmail(profile.email, { updateLastLogin: true });

        if (!user) {
            user = await sm.createUser({
                username: profile.global_name,
                email: profile.email
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

        const token = generateToken(user);

        logger.info(`Social account created and token generated for Discord user: ${user.id}`);

        const redirectUrl = isProduction ? process.env.PRODUCTION_URL : process.env.FRONTEND_URL;

        const queryParams = new URLSearchParams({
            avatar: new_social_account.avatar
        });

        return res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict'
        })
        .redirect(`${redirectUrl}?${queryParams.toString()}`);
    } catch (error) {
        logger.error(`Error processing Discord authentication: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
