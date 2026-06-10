import {
  editorialShadow,
  softShadow,
  primaryShadow,
} from '@/theme/elevation';

describe('elevation', () => {
  it('editorialShadow tem campos shadow* + elevation positiva', () => {
    expect(editorialShadow.shadowColor).toBeDefined();
    expect(editorialShadow.shadowOpacity).toBeGreaterThan(0);
    expect(editorialShadow.shadowRadius).toBeGreaterThan(0);
    expect(editorialShadow.elevation).toBeGreaterThan(0);
  });
  it('softShadow tem opacidade menor que editorial', () => {
    expect(softShadow.shadowOpacity).toBeLessThan(editorialShadow.shadowOpacity);
  });
  it('primaryShadow tem cor diferente (tint primary)', () => {
    expect(primaryShadow.shadowColor).toBe('#022448');
  });
});
