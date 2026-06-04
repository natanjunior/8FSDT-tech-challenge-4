import { loginSchema } from '@/features/auth/validators/login.schema';

describe('loginSchema', () => {
  it('accepts a valid email', () => {
    const result = loginSchema.safeParse({ email: 'professor@escola.edu' });
    expect(result.success).toBe(true);
  });

  it('rejects empty email with a friendly message', () => {
    const result = loginSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Informe seu e-mail.');
    }
  });

  it('rejects malformed email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('E-mail inválido.');
    }
  });

  it('trims whitespace before validation', () => {
    const result = loginSchema.safeParse({ email: '  prof@escola.edu  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('prof@escola.edu');
    }
  });
});
