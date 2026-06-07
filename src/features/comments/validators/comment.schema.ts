import { z } from 'zod';

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Escreva algo antes de enviar.')
    .max(1000, 'Comentário deve ter no máximo 1000 caracteres.'),
});

export type CommentFormData = z.infer<typeof commentSchema>;
