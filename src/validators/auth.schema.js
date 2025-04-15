import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(30, { message: 'Username must be 30 characters or less' })
        .trim(),

    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .transform((email) => email.toLowerCase()),

    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(40, 'Password must be 40 characters or less')
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    
    role: z.enum(['admin', 'user']).optional(),
});

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .transform((email) => email.toLowerCase()),

    password: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(40, 'Password must be 40 characters or less'),
});

export const toggleUserSchema = z.object({
    is_active: z.boolean({
        required_error: 'The is_active field is required',
        invalid_type_error: 'The is_active field must be a boolean',
    }),
});

export const updateUserSchema = z.object({ 
    username: z 
        .string({ required_error: 'Username is required' }) 
        .min(3, { message: 'Username must be at least 3 characters long' }) 
        .max(30, { message: 'Username must be 30 characters or less' }) 
        .trim(),
        
    email: z 
        .string({ required_error: 'Email is required' }) 
        .email('Invalid email format') 
        .transform((email) => email.toLowerCase())
});

export const passwordSchema = z.object({ 
    current_password: z 
        .string({ required_error: 'Password is required' }) 
        .min(8, { message: 'Password must be at least 8 characters long' }) 
        .max(40, 'Password must be 40 characters or less'), 
    new_password: z 
        .string({ required_error: 'Password is required' }) 
        .min(8, { message: 'Password must be at least 8 characters long' }) 
        .max(40, 'Password must be 40 characters or less') 
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }) 
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }) 
        .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }) 
});