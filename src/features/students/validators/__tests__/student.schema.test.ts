import { studentSchema, studentSignupSchema } from '@/features/students/validators/student.schema';

describe('studentSchema (admin create)', () => {
  const base = { name: 'Pedro Costa' };

  it('aceita mínimo válido', () => {
    expect(studentSchema.safeParse(base).success).toBe(true);
  });

  it('rejeita name vazio', () => {
    const r = studentSchema.safeParse({ ...base, name: '' });
    expect(r.success).toBe(false);
  });

  it('aceita course texto livre', () => {
    const r = studentSchema.safeParse({ ...base, course: 'Ensino Médio - 3º ano' });
    expect(r.success).toBe(true);
  });

  it('aceita ausência de user', () => {
    const r = studentSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.user).toBeUndefined();
  });

  it('aceita bloco user opcional', () => {
    const r = studentSchema.safeParse({
      ...base,
      user: { login: 'pedro', password: '12345678' },
    });
    expect(r.success).toBe(true);
  });
});

describe('studentSignupSchema (auto-cadastro)', () => {
  const base = {
    name: 'Pedro Costa',
    user: { login: 'pedro', password: '12345678' },
  };

  it('aceita payload com user obrigatório', () => {
    expect(studentSignupSchema.safeParse(base).success).toBe(true);
  });

  it('rejeita ausência de user', () => {
    const r = studentSignupSchema.safeParse({ name: 'Pedro' });
    expect(r.success).toBe(false);
  });

  it('rejeita user sem login', () => {
    const r = studentSignupSchema.safeParse({
      ...base,
      user: { login: '', password: '12345678' },
    });
    expect(r.success).toBe(false);
  });

  it('rejeita password curta', () => {
    const r = studentSignupSchema.safeParse({
      ...base,
      user: { login: 'p', password: '1234' },
    });
    expect(r.success).toBe(false);
  });
});
