export const colors = {
  // Núcleo M3 (espelha tokens da Fase 3 web — ver docs/fase 3/11-design-system.md)
  background: '#F9F9FF',
  foreground: '#111C2D',
  muted: '#43474E',
  border: '#C4C6CF',

  // Surface scale (M3)
  surface: '#F9F9FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F0F3FF',
  surfaceContainer: '#E7EEFF',
  surfaceContainerHigh: '#DEE8FF',
  card: '#E7EEFF', // alias legacy — manter para retrocompatibilidade

  // Primary
  primary: '#022448',
  primaryForeground: '#FFFFFF',
  primaryContainer: '#1E3A5F',
  onPrimaryContainer: '#8AA4CF',

  // Secondary (gradiente teal nos CTAs do web)
  secondary: '#006A61',
  secondaryContainer: '#86F2E4',
  onSecondaryContainer: '#005049',

  // Outlines + variantes
  outline: '#74777F',
  outlineVariant: '#C4C6CF',

  // Status (espelham o web — divergem dos M3 success/warning/neutral)
  statusPublished: '#22C55E',
  statusDraft: '#EAB308',
  statusArchived: '#94A3B8',

  // Semantic (uso geral, fora de status de post)
  success: '#16A34A',
  warning: '#D97706',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',

  // AuthorAvatar pastel palette (alinha com web src/components/ui/AuthorId.tsx)
  avatarBlue: { bg: '#DBEAFE', border: '#BFDBFE', text: '#1D4ED8' },     // blue-100/200/700
  avatarEmerald: { bg: '#D1FAE5', border: '#A7F3D0', text: '#047857' }, // emerald
  avatarTeal: { bg: '#CCFBF1', border: '#99F6E4', text: '#0F766E' },    // teal
  avatarAmber: { bg: '#FEF3C7', border: '#FDE68A', text: '#B45309' },   // amber
  avatarRose: { bg: '#FFE4E6', border: '#FECDD3', text: '#BE123C' },    // rose
  avatarViolet: { bg: '#EDE9FE', border: '#DDD6FE', text: '#6D28D9' },  // violet
  avatarSlate: { bg: '#F1F5F9', border: '#E2E8F0', text: '#475569' },   // fallback (anônimo/null)
} as const;

export type ColorToken = keyof typeof colors;
