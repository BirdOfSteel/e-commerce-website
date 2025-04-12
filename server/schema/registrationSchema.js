import zod from 'zod';

export const registrationSchema = zod.object({
    email: zod.string().email("Enter a valid email address").trim(),
    name: zod.string().min(1, "Name is required").trim(),
    password: zod
        .string()
        .min(7, "Password must be at least 7 characters")
        .max(20, "Password must be at most 20 characters")
        .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
        "Password must include at least 1 number and 1 symbol."
    )
});