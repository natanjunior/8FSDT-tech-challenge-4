import { teacherSchema } from '@/features/teachers/validators/teacher.schema';

describe('teacherSchema', () => {
  const base = { name: 'João Silva', discipline_ids: [] };

  it('accepts minimum valid teacher (só name)', () => {
    const r = teacherSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it('rejects name vazio', () => {
    const r = teacherSchema.safeParse({ ...base, name: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('Nome é obrigatório.');
    }
  });

  it('aceita email válido', () => {
    const r = teacherSchema.safeParse({ ...base, email: 'a@b.com' });
    expect(r.success).toBe(true);
  });

  it('rejeita email inválido', () => {
    const r = teacherSchema.safeParse({ ...base, email: 'naoehemail' });
    expect(r.success).toBe(false);
  });

  it('aceita email vazio (transformado em undefined)', () => {
    const r = teacherSchema.safeParse({ ...base, email: '' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBeUndefined();
  });

  it('aceita birth_date no formato YYYY-MM-DD', () => {
    const r = teacherSchema.safeParse({ ...base, birth_date: '1990-05-15' });
    expect(r.success).toBe(true);
  });

  it('rejeita birth_date em formato incorreto', () => {
    const r = teacherSchema.safeParse({ ...base, birth_date: '15/05/1990' });
    expect(r.success).toBe(false);
  });

  it('aceita pronouns válidos', () => {
    for (const p of ['ele/dele', 'ela/dela', 'elu/delu', 'outro']) {
      const r = teacherSchema.safeParse({ ...base, pronouns: p });
      expect(r.success).toBe(true);
    }
  });

  it('rejeita pronouns inválido', () => {
    const r = teacherSchema.safeParse({ ...base, pronouns: 'eles/deles' });
    expect(r.success).toBe(false);
  });

  it('aceita discipline_ids como array vazio ou UUIDs', () => {
    const r1 = teacherSchema.safeParse({ ...base, discipline_ids: [] });
    expect(r1.success).toBe(true);
    const r2 = teacherSchema.safeParse({
      ...base,
      discipline_ids: ['660e8400-e29b-41d4-a716-446655440001'],
    });
    expect(r2.success).toBe(true);
  });

  it('rejeita discipline_id mal formado', () => {
    const r = teacherSchema.safeParse({
      ...base,
      discipline_ids: ['nao-eh-uuid'],
    });
    expect(r.success).toBe(false);
  });

  it('aceita bloco user com login e password válidos', () => {
    const r = teacherSchema.safeParse({
      ...base,
      user: { login: 'joao.silva', password: '12345678' },
    });
    expect(r.success).toBe(true);
  });

  it('rejeita password < 8 chars no bloco user', () => {
    const r = teacherSchema.safeParse({
      ...base,
      user: { login: 'joao', password: '1234' },
    });
    expect(r.success).toBe(false);
  });

  it('aceita ausência de user', () => {
    const r = teacherSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.user).toBeUndefined();
  });
});
