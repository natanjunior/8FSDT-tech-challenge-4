import { apiClient } from '@/api/client';
import type { Comment, PaginatedResponse } from '@/types/api';

const DEFAULT_LIMIT = 10;

interface ListCommentsParams {
  page?: number;
}

interface CreateCommentPayload {
  content: string;
}

export async function listComments(
  postId: string,
  params: ListCommentsParams = {}
): Promise<PaginatedResponse<Comment>> {
  const { data } = await apiClient.get<PaginatedResponse<Comment>>(
    '/comments/search',
    {
      params: { post_id: postId, page: params.page ?? 1, limit: DEFAULT_LIMIT },
    }
  );
  return data;
}

export async function createComment(
  postId: string,
  payload: CreateCommentPayload
): Promise<Comment> {
  const { data } = await apiClient.post<Comment>('/comments', {
    post_id: postId,
    content: payload.content,
  });
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await apiClient.delete(`/comments/${commentId}`);
}
