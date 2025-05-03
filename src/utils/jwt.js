import jwt from "jsonwebtoken";
import { promisify } from "util";

process.loadEnvFile();

const signAsync = promisify(jwt.sign);

export const generateToken = async (user) => {    
    const payload = { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role ? user.role : 'user' 
    }; 

    try{
        return await signAsync(payload, process.env.JWT_SECRET, { 
            expiresIn: process.env.JWT_EXPIRES_IN 
        });    
    } catch (error) { 
        throw new Error(`Error generating token: ${error.message}`);
    }
};