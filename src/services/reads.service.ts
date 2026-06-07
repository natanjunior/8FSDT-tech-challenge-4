import { apiClient } from '@/api/client';
import type { PaginatedResponse, Read } from '@/types/api';

export async function markAsRead(postId: string): Promise<Read> {
  const { data } = await apiClient.post<Read>('/reads', { post_id: postId });
  return data;
}

export async function hasReadPost(postId: string): Promise<boolean> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<Read>>(
      '/reads/search',
      { params: { post_id: postId } }
    );
    return data.data.length > 0;
  } catch {
    return false;
  }
}
