import { apiClient } from '@/api/client';
import {
  listComments,
  createComment,
  deleteComment,
} from '@/services/comments.service';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

const fakeComment = {
  id: 'c1',
  content: 'oi',
  author: {
    id: 'Student/550e8400-e29b-41d4-a716-446655440003',
    type: 'Student' as const,
    name: 'Pedro Costa',
  },
  can_delete: true,
  created_at: '2026-01-01T00:00:00Z',
};

describe('comments.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listComments', () => {
    it('calls GET /comments/search with post_id and defaults', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: [fakeComment], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } },
      });
      const result = await listComments('p1');
      expect(mockGet).toHaveBeenCalledWith('/comments/search', {
        params: { post_id: 'p1', page: 1, limit: 10 },
      });
      expect(result.data).toHaveLength(1);
    });

    it('respects custom page', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: [], pagination: { page: 2, limit: 10, total: 0, totalPages: 0 } },
      });
      await listComments('p1', { page: 2 });
      expect(mockGet).toHaveBeenCalledWith('/comments/search', {
        params: { post_id: 'p1', page: 2, limit: 10 },
      });
    });
  });

  describe('createComment', () => {
    it('calls POST /comments with post_id and content', async () => {
      mockPost.mockResolvedValueOnce({ data: fakeComment });
      const result = await createComment('p1', { content: 'oi' });
      expect(mockPost).toHaveBeenCalledWith('/comments', {
        post_id: 'p1',
        content: 'oi',
      });
      expect(result.id).toBe('c1');
    });

    it('returns the comment shape with author and can_delete', async () => {
      mockPost.mockResolvedValueOnce({ data: fakeComment });
      const result = await createComment('p1', { content: 'oi' });
      expect(result.author?.type).toBe('Student');
      expect(result.can_delete).toBe(true);
    });
  });

  describe('deleteComment', () => {
    it('calls DELETE /comments/:id', async () => {
      mockDelete.mockResolvedValueOnce({ status: 204 });
      await deleteComment('c1');
      expect(mockDelete).toHaveBeenCalledWith('/comments/c1');
    });
  });
});
