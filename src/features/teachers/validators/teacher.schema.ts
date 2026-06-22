import { z } from 'zod';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const teacherSchema = z.object({
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
  discipline_ids: z
    .array(z.string().regex(UUID_REGEX, 'Disciplina inválida.'))
    .default([]),
  user: z
    .preprocess(
      (v) => {
        if (v === undefined || v === null) return undefined;
        const u = v as { login?: string; password?: string };
        if (!u.login && !u.password) return undefined;
        return v;
      },
      z
        .object({
          login: z.string().min(1, 'Login é obrigatório.'),
          password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres.'),
        })
        .optional()
    ),
});

export type TeacherFormInput = z.input<typeof teacherSchema>;
export type TeacherFormData = z.output<typeof teacherSchema>;
