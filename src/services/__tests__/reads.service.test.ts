import { apiClient } from '@/api/client';
import { markAsRead, hasReadPost } from '@/services/reads.service';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

describe('reads.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markAsRead', () => {
    it('calls POST /reads with post_id and returns Read with reader as FhirRef', async () => {
      mockPost.mockResolvedValueOnce({
        data: {
          id: 'r1',
          post_id: 'p1',
          reader: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
          read_at: '2026-01-01T00:00:00Z',
        },
      });
      const result = await markAsRead('p1');
      expect(mockPost).toHaveBeenCalledWith('/reads', { post_id: 'p1' });
      expect(result.post_id).toBe('p1');
      expect(result.reader).toBe('Teacher/550e8400-e29b-41d4-a716-446655440001');
    });
  });

  describe('hasReadPost', () => {
    it('returns true when GET /reads/search returns non-empty data', async () => {
      mockGet.mockResolvedValueOnce({
        data: {
          data: [{ id: 'r1', post_id: 'p1', reader: 'Student/550e8400-e29b-41d4-a716-446655440003', read_at: '2026-01-01' }],
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        },
      });
      const result = await hasReadPost('p1');
      expect(mockGet).toHaveBeenCalledWith('/reads/search', { params: { post_id: 'p1' } });
      expect(result).toBe(true);
    });

    it('returns false when data array is empty', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } },
      });
      const result = await hasReadPost('p1');
      expect(result).toBe(false);
    });

    it('returns false on any error (defensive)', async () => {
      mockGet.mockRejectedValueOnce(new Error('401'));
      const result = await hasReadPost('p1');
      expect(result).toBe(false);
    });
  });
});
