import { apiClient } from '@/api/client';
import {
  listDisciplines,
  SEED_DISCIPLINES,
} from '@/services/disciplines.service';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;

describe('disciplines.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SEED_DISCIPLINES', () => {
    it('exposes the 5 seed disciplines with stable UUIDs', () => {
      expect(SEED_DISCIPLINES).toHaveLength(5);
      expect(SEED_DISCIPLINES.map((d) => d.label).sort()).toEqual([
        'Ciências',
        'Geografia',
        'História',
        'Matemática',
        'Português',
      ]);
      SEED_DISCIPLINES.forEach((d) => {
        expect(d.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        );
      });
    });
  });

  describe('listDisciplines', () => {
    it('returns API result when call succeeds', async () => {
      mockGet.mockResolvedValueOnce({
        data: [
          { id: 'd1', label: 'Matemática', created_at: '2024-01-01' },
          { id: 'd2', label: 'Português', created_at: '2024-01-01' },
        ],
      });
      const result = await listDisciplines();
      expect(mockGet).toHaveBeenCalledWith('/disciplines');
      expect(result).toHaveLength(2);
    });

    it('returns SEED_DISCIPLINES on any error (likely 401 — no auth)', async () => {
      mockGet.mockRejectedValueOnce(new Error('401'));
      const result = await listDisciplines();
      expect(result).toEqual(SEED_DISCIPLINES);
    });
  });
});
