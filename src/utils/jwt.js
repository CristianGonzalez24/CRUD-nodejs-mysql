import jwt from "jsonwebtoken";
import { promisify } from "util";

process.loadEnvFile();

const signAsync = promisify(jwt.sign);

export const generateTokens = async (user, refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
    };

    try {
        const accessToken = await signAsync(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '15m'
        });

        const refreshToken = await signAsync(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: refreshExpiresIn,
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(`Error generating tokens: ${error.message}`);
    }
};
