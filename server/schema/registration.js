import zod from 'zod';

export const registrationSchema = zod.object({
    email: zod.string().email("Enter a valid email address"),
    name: zod.string().min(1, "Name is required"),
    password: zod
        .string()
        .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{7,20}$/,
        "Password must be 7 to 20 characters, include at least 1 number and 1 symbol."
    )
});