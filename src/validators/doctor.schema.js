import { z } from "zod";

const timeValidator = z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format')
    .refine((val) => {
        const [hours, minutes] = val.split(':').map(Number);
        return (
            Number.isInteger(hours) &&
            Number.isInteger(minutes) &&
            hours >= 0 && hours < 24 &&
            minutes >= 0 && minutes < 60
        );
    }, {
    message: 'Invalid time: must be a valid 24-hour time between 00:00 and 23:59'
});

export const availabilitySchema = z.array(
    z.object({
        day: z.enum([
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ]),
        from: timeValidator,
        to: timeValidator
    })
    .refine((data) => {
        return data.from < data.to;
    }, {
        message: "End time must be after start time",
        path: ["to"]
    })
);

export const doctorSchema = z.object({
    first_name: z
        .string({ required_error: 'First name is required' })
        .trim()
        .min(3, { message: 'First name must be at least 3 characters long' })
        .max(30, { message: 'First name must be 30 characters or less' }),

    last_name: z
        .string({ required_error: 'Last name is required' })
        .trim()
        .min(3, { message: 'Last name must be at least 3 characters long' })
        .max(30, { message: 'Last name must be 30 characters or less' }),

    phone: z
        .string()
        .optional()
        .refine(
        (value) =>
            value === null || value === undefined || /^\d{7,15}$/.test(value),
        {
            message:
            'Phone must contain only digits and be 7 to 15 characters long',
        }
        ),

    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .transform((email) => email.toLowerCase()),

    years_of_experience: z
        .number()
        .int()
        .nonnegative('Years of experience must be a positive number')
        .optional(),

    is_active: z
        .boolean({ invalid_type_error: 'Is active must be a boolean' })
        .optional(),
    
    specialties: z
        .array(z.string().min(3, "Each specialty must be at least 3 characters long"))
        .min(1, "At least one specialty is required")
        .optional(),

    availability: availabilitySchema.optional()
});