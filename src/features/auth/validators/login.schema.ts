import { z } from 'zod';

export const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, 'Informe seu login.'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
