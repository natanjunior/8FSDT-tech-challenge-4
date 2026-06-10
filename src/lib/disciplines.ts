import type { IconName } from '@/components/ui/Icon';

export interface DisciplineMeta {
  icon: IconName;
  color: string;
  label: string;
}

/**
 * Disciplinas oficiais do app, com ícone e cor canônicos.
 * Espelha o mapping do web (src/components/admin/PostForm.tsx + Sidebar +
 * docs/uiux/PROTOTYPE_NOTES.md §3 "Mapeamento disciplina → ícone Material Symbols").
 *
 * Cores: blue-600 / amber-600 / emerald-600 / rose-600 / teal-600 (Tailwind defaults).
 */
export const DISCIPLINE_META: Record<string, DisciplineMeta> = {
  'Matemática': { icon: 'function-variant', color: '#2563EB', label: 'Matemática' },
  'Português': { icon: 'book-open-page-variant-outline', color: '#D97706', label: 'Português' },
  'Ciências': { icon: 'flask-outline', color: '#059669', label: 'Ciências' },
  'História': { icon: 'book-clock', color: '#E11D48', label: 'História' },
  'Geografia': { icon: 'earth', color: '#0D9488', label: 'Geografia' },
};

export const DISCIPLINE_FALLBACK: DisciplineMeta = {
  icon: 'school-outline',
  color: '#94A3B8',
  label: 'Sem disciplina',
};

export function getDisciplineMeta(label: string | null | undefined): DisciplineMeta {
  if (!label) return DISCIPLINE_FALLBACK;
  return DISCIPLINE_META[label] ?? DISCIPLINE_FALLBACK;
}
