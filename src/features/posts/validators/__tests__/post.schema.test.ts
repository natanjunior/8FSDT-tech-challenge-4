import { postSchema } from '@/features/posts/validators/post.schema';

describe('postSchema', () => {
  const validBase = {
    title: 'Introdução à Álgebra Linear',
    content: 'Conteúdo do post com mais de dez caracteres.',
    status: 'DRAFT' as const,
  };

  it('accepts a minimum valid post', () => {
    const result = postSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepts an optional discipline_id (UUID)', () => {
    const result = postSchema.safeParse({
      ...validBase,
      discipline_id: '660e8400-e29b-41d4-a716-446655440001',
    });
    expect(result.success).toBe(true);
  });

  it('transforms empty discipline_id to undefined', () => {
    const result = postSchema.safeParse({ ...validBase, discipline_id: '' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.discipline_id).toBeUndefined();
    }
  });

  it('rejects title shorter than 5 chars', () => {
    const result = postSchema.safeParse({ ...validBase, title: 'oi' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Título deve ter entre 5 e 255 caracteres.'
      );
    }
  });

  it('rejects title longer than 255 chars', () => {
    const result = postSchema.safeParse({
      ...validBase,
      title: 'a'.repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it('trims title before validation', () => {
    const result = postSchema.safeParse({
      ...validBase,
      title: '   oi   ',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Título deve ter entre 5 e 255 caracteres.'
      );
    }
  });

  it('rejects content shorter than 10 chars', () => {
    const result = postSchema.safeParse({ ...validBase, content: 'curto' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        'Conteúdo deve ter no mínimo 10 caracteres.'
      );
    }
  });

  it('preserves whitespace in content (does NOT trim)', () => {
    const result = postSchema.safeParse({
      ...validBase,
      content: '   conteudo  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe('   conteudo  ');
    }
  });

  it('rejects invalid status enum', () => {
    const result = postSchema.safeParse({ ...validBase, status: 'OUTRO' });
    expect(result.success).toBe(false);
  });

  it('rejects malformed discipline_id when provided', () => {
    const result = postSchema.safeParse({
      ...validBase,
      discipline_id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });
});
