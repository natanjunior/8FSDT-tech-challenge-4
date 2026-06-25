import { changePasswordSchema } from '@/features/profile/validators/change-password.schema';

describe('changePasswordSchema', () => {
  const valid = {
    current_password: 'senhaAtual',
    new_password: 'novaSenha123',
    new_password_confirm: 'novaSenha123',
  };

  it('aceita payload válido', () => {
    const r = changePasswordSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rejeita current_password vazia', () => {
    const r = changePasswordSchema.safeParse({ ...valid, current_password: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('Senha atual é obrigatória.');
    }
  });

  it('rejeita new_password com menos de 8 chars', () => {
    const r = changePasswordSchema.safeParse({
      ...valid,
      new_password: '1234567',
      new_password_confirm: '1234567',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe(
        'Nova senha deve ter no mínimo 8 caracteres.'
      );
    }
  });

  it('rejeita quando new_password ≠ new_password_confirm', () => {
    const r = changePasswordSchema.safeParse({
      ...valid,
      new_password_confirm: 'outra123',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const confirmIssue = r.error.issues.find(
        (i) => i.path[0] === 'new_password_confirm'
      );
      expect(confirmIssue?.message).toBe('As senhas não conferem.');
    }
  });

  it('rejeita nova senha igual à atual', () => {
    const r = changePasswordSchema.safeParse({
      current_password: 'mesmaSenha123',
      new_password: 'mesmaSenha123',
      new_password_confirm: 'mesmaSenha123',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === 'new_password');
      expect(issue?.message).toBe('A nova senha deve ser diferente da atual.');
    }
  });
});
