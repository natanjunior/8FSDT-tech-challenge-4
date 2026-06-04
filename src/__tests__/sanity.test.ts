import { PROJECT_NAME } from '@/constants';

describe('sanity', () => {
  it('resolves @ alias and constant export', () => {
    expect(PROJECT_NAME).toBe('8FSDT Tech Challenge — Fase 4');
  });
});
