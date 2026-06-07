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
    .refine(
      (v) => v === undefined || v === '' || UUID_REGEX.test(v),
      'Disciplina inválida.'
    )
    .transform((v) => (v === '' ? undefined : v)),
});

// Input type — what the form fields hold (discipline_id may be '' or UUID or undefined)
export type PostFormInput = z.input<typeof postSchema>;
// Output type — what submit handlers receive after transform
export type PostFormData = z.output<typeof postSchema>;
