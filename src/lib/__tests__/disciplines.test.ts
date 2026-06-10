import {
  DISCIPLINE_META,
  getDisciplineMeta,
  DISCIPLINE_FALLBACK,
} from '@/lib/disciplines';

describe('disciplines lib', () => {
  it('mapeia todas as 5 disciplinas oficiais', () => {
    expect(DISCIPLINE_META['Matemática']).toBeDefined();
    expect(DISCIPLINE_META['Português']).toBeDefined();
    expect(DISCIPLINE_META['Ciências']).toBeDefined();
    expect(DISCIPLINE_META['História']).toBeDefined();
    expect(DISCIPLINE_META['Geografia']).toBeDefined();
  });
  it('cada disciplina tem icon e color', () => {
    for (const key of Object.keys(DISCIPLINE_META)) {
      const meta = DISCIPLINE_META[key]!;
      expect(meta.icon).toBeTruthy();
      expect(meta.color).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
  it('getDisciplineMeta retorna fallback para label desconhecida', () => {
    expect(getDisciplineMeta('Inexistente')).toEqual(DISCIPLINE_FALLBACK);
  });
  it('getDisciplineMeta retorna fallback para null/undefined', () => {
    expect(getDisciplineMeta(null)).toEqual(DISCIPLINE_FALLBACK);
    expect(getDisciplineMeta(undefined)).toEqual(DISCIPLINE_FALLBACK);
  });
});
