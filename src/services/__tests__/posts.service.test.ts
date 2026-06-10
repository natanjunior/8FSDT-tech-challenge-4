import { apiClient } from '@/api/client';
import {
  listPosts,
  searchPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '@/services/posts.service';

jest.mock('@/api/client', () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

const fakePost = {
  id: 'p1',
  title: 'Teste',
  content: 'Conteúdo',
  status: 'PUBLISHED',
  published_at: '2026-01-01T10:00:00Z',
  created_at: '2026-01-01T10:00:00Z',
  updated_at: '2026-01-01T10:00:00Z',
  author: {
    id: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
    name: 'Prof. João',
    pronouns: 'ele/dele',
  },
  discipline: { id: 'd1', label: 'Matemática' },
  comments_count: 0,
  reads_count: 0,
};

const fakeListResponse = {
  data: { data: [fakePost], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } },
};

describe('posts.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listPosts', () => {
    it('calls GET /posts with default page/limit/sort', async () => {
      mockGet.mockResolvedValueOnce(fakeListResponse);
      const result = await listPosts();
      expect(mockGet).toHaveBeenCalledWith('/posts', {
        params: { page: 1, limit: 10, sort: '-published_at' },
      });
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('respects custom page and limit', async () => {
      mockGet.mockResolvedValueOnce(fakeListResponse);
      await listPosts({ page: 3, limit: 20 });
      expect(mockGet).toHaveBeenCalledWith('/posts', {
        params: { page: 3, limit: 20, sort: '-published_at' },
      });
    });
  });

  describe('searchPosts', () => {
    it('uses /posts/search and includes query when present', async () => {
      mockGet.mockResolvedValueOnce(fakeListResponse);
      await searchPosts({ query: 'algebra', page: 1 });
      expect(mockGet).toHaveBeenCalledWith('/posts/search', {
        params: { query: 'algebra', page: 1, limit: 10, sort: '-published_at' },
      });
    });

    it('includes discipline filter when present', async () => {
      mockGet.mockResolvedValueOnce(fakeListResponse);
      await searchPosts({ discipline: 'd1-uuid' });
      expect(mockGet).toHaveBeenCalledWith('/posts/search', {
        params: { discipline: 'd1-uuid', page: 1, limit: 10, sort: '-published_at' },
      });
    });

    it('omits filters when not provided', async () => {
      mockGet.mockResolvedValueOnce(fakeListResponse);
      await searchPosts({});
      expect(mockGet).toHaveBeenCalledWith('/posts/search', {
        params: { page: 1, limit: 10, sort: '-published_at' },
      });
    });
  });

  describe('getPostById', () => {
    it('calls GET /posts/:id', async () => {
      mockGet.mockResolvedValueOnce({ data: fakePost });
      const post = await getPostById('p1');
      expect(mockGet).toHaveBeenCalledWith('/posts/p1');
      expect(post.id).toBe('p1');
    });
  });

  describe('createPost', () => {
    const payload = {
      title: 'Novo post',
      content: 'Conteúdo com mais de dez caracteres.',
      status: 'DRAFT' as const,
      discipline_id: undefined,
    };

    it('calls POST /posts with the payload', async () => {
      mockPost.mockResolvedValueOnce({
        data: { ...fakePost, id: 'new1' },
      });
      const created = await createPost(payload);
      expect(mockPost).toHaveBeenCalledWith('/posts', payload);
      expect(created.id).toBe('new1');
    });

    it('includes discipline_id when provided', async () => {
      mockPost.mockResolvedValueOnce({ data: fakePost });
      await createPost({ ...payload, discipline_id: 'd1' });
      expect(mockPost).toHaveBeenCalledWith('/posts', {
        ...payload,
        discipline_id: 'd1',
      });
    });
  });

  describe('updatePost', () => {
    it('calls PATCH /posts/:id with the partial payload', async () => {
      mockPatch.mockResolvedValueOnce({
        data: { ...fakePost, status: 'PUBLISHED' },
      });
      const updated = await updatePost('p1', { status: 'PUBLISHED' });
      expect(mockPatch).toHaveBeenCalledWith('/posts/p1', {
        status: 'PUBLISHED',
      });
      expect(updated.status).toBe('PUBLISHED');
    });
  });

  describe('deletePost', () => {
    it('calls DELETE /posts/:id and resolves void', async () => {
      mockDelete.mockResolvedValueOnce({ status: 204 });
      await expect(deletePost('p1')).resolves.toBeUndefined();
      expect(mockDelete).toHaveBeenCalledWith('/posts/p1');
    });

    it('propagates errors from the API', async () => {
      mockDelete.mockRejectedValueOnce(new Error('forbidden'));
      await expect(deletePost('p1')).rejects.toThrow('forbidden');
    });
  });
});
