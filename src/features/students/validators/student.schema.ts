import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const userBlock = z.object({
  login: z.string().min(1, 'Login é obrigatório.'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres.'),
});

export const studentSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.'),
  email: z
    .string()
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : v))
    .refine(
      (v) => v === undefined || /.+@.+\..+/.test(v),
      'Email inválido.'
    ),
  birth_date: z
    .string()
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : v))
    .refine(
      (v) => v === undefined || DATE_REGEX.test(v),
      'Data deve estar no formato AAAA-MM-DD.'
    ),
  pronouns: z
    .enum(['ele/dele', 'ela/dela', 'elu/delu', 'outro'])
    .optional(),
  biography: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  course: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  user: userBlock.optional(),
});

/** Variant de auto-cadastro: user é obrigatório. */
export const studentSignupSchema = studentSchema.extend({
  user: userBlock,
});

export type StudentFormInput = z.input<typeof studentSchema>;
export type StudentFormData = z.output<typeof studentSchema>;
export type StudentSignupData = z.output<typeof studentSignupSchema>;
