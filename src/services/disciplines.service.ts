import { apiClient } from '@/api/client';
import type { Discipline } from '@/types/api';

export const SEED_DISCIPLINES: Discipline[] = [
  { id: '660e8400-e29b-41d4-a716-446655440001', label: 'Matemática' },
  { id: '660e8400-e29b-41d4-a716-446655440002', label: 'Português' },
  { id: '660e8400-e29b-41d4-a716-446655440003', label: 'Ciências' },
  { id: '660e8400-e29b-41d4-a716-446655440004', label: 'História' },
  { id: '660e8400-e29b-41d4-a716-446655440005', label: 'Geografia' },
];

export async function listDisciplines(): Promise<Discipline[]> {
  try {
    const { data } = await apiClient.get<Discipline[]>('/disciplines');
    return data;
  } catch {
    return SEED_DISCIPLINES;
  }
}
