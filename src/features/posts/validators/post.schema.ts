import { z } from 'zod';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Título deve ter entre 5 e 255 caracteres.')
    .max(255, 'Título deve ter entre 5 e 255 caracteres.'),
  content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres.'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
    message: 'Status inválido.',
  }),
  discipline_id: z
    .string()
    .optional()
    .transform((v) => (v === '' || v === undefined ? undefined : v))
    .refine(
      (v) => v === undefined || UUID_REGEX.test(v),
      'Disciplina inválida.'
    ),
});

export type PostFormData = z.infer<typeof postSchema>;
