export const colors = {
  // Núcleo M3 (espelha tokens da Fase 3 web — ver docs/fase 3/11-design-system.md)
  background: '#F9F9FF',
  foreground: '#111C2D',
  muted: '#43474E',
  border: '#C4C6CF',
  card: '#E7EEFF',

  primary: '#022448',
  primaryForeground: '#FFFFFF',
  primaryContainer: '#1E3A5F',
  onPrimaryContainer: '#8AA4CF',

  secondary: '#006A61',
  secondaryContainer: '#86F2E4',
  onSecondaryContainer: '#006F66',

  surfaceContainerLow: '#F0F3FF',
  surfaceContainerHigh: '#DEE8FF',
  surfaceContainerLowest: '#FFFFFF',

  outline: '#74777F',

  success: '#16A34A',
  warning: '#D97706',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
} as const;

export type ColorToken = keyof typeof colors;
