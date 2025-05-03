import { z } from 'zod';

export const discordProfileSchema = z.object({
    id: z.string(),                            
    username: z.string(),                      
    global_name: z.string().nullable(),       
    email: z.string().email().nullable(),      
    discriminator: z.string().optional(),      
    avatar: z.string().optional()              
});