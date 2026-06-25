import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Senha atual é obrigatória.'),
    new_password: z
      .string()
      .min(8, 'Nova senha deve ter no mínimo 8 caracteres.'),
    new_password_confirm: z.string(),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: 'As senhas não conferem.',
    path: ['new_password_confirm'],
  })
  .refine((d) => d.current_password !== d.new_password, {
    message: 'A nova senha deve ser diferente da atual.',
    path: ['new_password'],
  });

export type ChangePasswordFormInput = z.input<typeof changePasswordSchema>;
export type ChangePasswordFormData = z.output<typeof changePasswordSchema>;
