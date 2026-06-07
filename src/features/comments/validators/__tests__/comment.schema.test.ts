import { commentSchema } from '@/features/comments/validators/comment.schema';

describe('commentSchema', () => {
  it('accepts valid content', () => {
    const result = commentSchema.safeParse({ content: 'Ótimo post!' });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = commentSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Escreva algo antes de enviar.');
    }
  });

  it('rejects whitespace-only content (trims to empty)', () => {
    const result = commentSchema.safeParse({ content: '   ' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Escreva algo antes de enviar.');
    }
  });

  it('rejects content longer than 1000 chars', () => {
    const long = 'a'.repeat(1001);
    const result = commentSchema.safeParse({ content: long });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Comentário deve ter no máximo 1000 caracteres.');
    }
  });

  it('trims content before validation', () => {
    const result = commentSchema.safeParse({ content: '   olá   ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.content).toBe('olá');
    }
  });

  it('ignores extra fields like author_name (strips by default)', () => {
    const result = commentSchema.safeParse({ content: 'olá', author_name: 'Maria' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ content: 'olá' });
      // @ts-expect-error author_name não está no shape do schema
      expect(result.data.author_name).toBeUndefined();
    }
  });
});
