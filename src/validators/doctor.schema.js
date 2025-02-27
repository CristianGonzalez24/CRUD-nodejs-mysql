import { z } from "zod";

export const doctorSchema = z.object({
    first_name: z
        .string({required_error: 'First name is required'})
        .min(3, {message: 'First name must be at least 3 characters long'})
        .max(30, "First name must be 30 characters or less"),
    last_name: z
        .string({required_error: 'Last name is required'})
        .min(3, {message: 'Last name must be at least 3 characters long'})
        .max(30, "Last name must be 30 characters or less"),
    specialty: z
        .string({required_error: 'Specialty is required'})
        .min(3, {message: 'Specialty must be at least 3 characters long'})
        .max(40, "Specialty must be 40 characters or less"),
    phone: z
        .string()
        .optional()
        .refine((value) => value === null || value === undefined || /^\d{7,15}$/.test(value), {
            message: "Phone must contain only digits and be 7 to 15 characters long",
        }),
    email: z
        .string()
        .email("Invalid email format")
        .optional(),
    years_of_experience: z
        .number()
        .int()
        .nonnegative("Years of experience must be a positive number")
        .optional(),
    is_active: z
        .boolean()
        .optional(),
});