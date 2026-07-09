import { stripMarkdown } from '@/lib/markdown';

describe('stripMarkdown', () => {
  it('remove marcadores de título', () => {
    expect(stripMarkdown('# Título')).toBe('Título');
  });

  it('remove marcadores de negrito e itálico', () => {
    expect(stripMarkdown('Texto **negrito** e *itálico*')).toBe(
      'Texto negrito e itálico'
    );
  });

  it('converte links no seu texto', () => {
    expect(stripMarkdown('Veja [o site](https://x.com) aqui')).toBe(
      'Veja o site aqui'
    );
  });

  it('remove crases de código inline', () => {
    expect(stripMarkdown('Use `npm install`')).toBe('Use npm install');
  });

  it('colapsa quebras de linha e espaços múltiplos em espaço único', () => {
    expect(stripMarkdown('linha 1\n\nlinha 2')).toBe('linha 1 linha 2');
  });

  it('remove marcadores de lista', () => {
    expect(stripMarkdown('- item 1\n- item 2')).toBe('item 1 item 2');
  });

  it('deixa texto puro inalterado', () => {
    expect(stripMarkdown('Texto simples sem marcação')).toBe(
      'Texto simples sem marcação'
    );
  });
});
