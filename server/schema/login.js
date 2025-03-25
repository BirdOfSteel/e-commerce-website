import zod from 'zod';

export const loginSchema = zod.object({
    email: zod.string().email().trim(),
    password: zod.string().min(1, "Password is required")
});