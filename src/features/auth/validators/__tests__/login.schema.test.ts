import { loginSchema } from '@/features/auth/validators/login.schema';

describe('loginSchema', () => {
  const valid = { login: 'joao.silva', password: 'senha123' };

  it('accepts valid login + password', () => {
    const result = loginSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects empty login', () => {
    const result = loginSchema.safeParse({ ...valid, login: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Informe seu login.');
    }
  });

  it('trims login whitespace', () => {
    const result = loginSchema.safeParse({ ...valid, login: '  joao.silva  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.login).toBe('joao.silva');
    }
  });

  it('rejects password with less than 8 chars', () => {
    const result = loginSchema.safeParse({ ...valid, password: '1234567' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Senha deve ter no mínimo 8 caracteres.'
      );
    }
  });

  it('accepts password with exactly 8 chars', () => {
    const result = loginSchema.safeParse({ ...valid, password: '12345678' });
    expect(result.success).toBe(true);
  });

  it('does NOT trim password (preserves intentional whitespace)', () => {
    const result = loginSchema.safeParse({
      ...valid,
      password: '  senha12  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.password).toBe('  senha12  ');
    }
  });
});
