/**
 * Subset of ViewStyle shadow fields with concrete numeric types so that
 * TypeScript consumers (including tests) can pass these values directly to
 * numeric matchers without casts.
 */
interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/**
 * Editorial shadow — exata tradução do `box-shadow` web (`editorial-shadow`):
 *   box-shadow: 0 20px 25px -5px rgb(2 36 72 / 0.05),
 *               0 8px 10px -6px rgb(2 36 72 / 0.05);
 * RN não suporta dual-shadow nativamente — combinamos em um único shadow
 * com offset/opacidade próximos da média visual.
 */
export const editorialShadow: ShadowStyle = {
  shadowColor: '#022448',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.05,
  shadowRadius: 20,
  elevation: 6,
};

/**
 * Soft shadow — para cards menores e modais leves (ambient shadow).
 * Equivale ao `shadow-xl shadow-sky-950/5` do web.
 */
export const softShadow: ShadowStyle = {
  shadowColor: '#022448',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 3,
};

/**
 * Primary shadow — para botões CTA gradient (variante primary).
 * Mais saturada, sombra colorida (tint secondary).
 */
export const primaryShadow: ShadowStyle = {
  shadowColor: '#022448',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 5,
};
