import { apiClient } from '@/api/client';
import type { PaginatedResponse, Post } from '@/types/api';

const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = '-published_at';

interface ListPostsParams {
  page?: number;
  limit?: number;
}

interface SearchPostsParams {
  query?: string;
  discipline?: string;
  page?: number;
  limit?: number;
}

export async function listPosts(
  params: ListPostsParams = {}
): Promise<PaginatedResponse<Post>> {
  const { data } = await apiClient.get<PaginatedResponse<Post>>('/posts', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? DEFAULT_LIMIT,
      sort: DEFAULT_SORT,
    },
  });
  return data;
}

export async function searchPosts(
  params: SearchPostsParams = {}
): Promise<PaginatedResponse<Post>> {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_LIMIT,
    sort: DEFAULT_SORT,
  };
  if (params.query) searchParams.query = params.query;
  if (params.discipline) searchParams.discipline = params.discipline;

  const { data } = await apiClient.get<PaginatedResponse<Post>>(
    '/posts/search',
    { params: searchParams }
  );
  return data;
}

export async function getPostById(id: string): Promise<Post> {
  const { data } = await apiClient.get<Post>(`/posts/${id}`);
  return data;
}
