import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import {
  listComments,
  createComment,
  deleteComment,
} from '@/services/comments.service';
import type { Comment, Pagination } from '@/types/api';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPage = useCallback(
    async (page: number, append = false) => {
      try {
        if (!append) setIsLoading(true);
        const result = await listComments(postId, { page });
        setComments((prev) => (append ? [...prev, ...result.data] : result.data));
        setPagination(result.pagination);
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar comentários',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const handleSubmit = async (data: { content: string }) => {
    setIsSubmitting(true);
    try {
      await createComment(postId, data);
      await loadPage(1);
      Toast.show({ type: 'success', text1: 'Comentário publicado.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Não foi possível publicar.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      Toast.show({ type: 'success', text1: 'Comentário removido.' });
    } catch {
      Toast.show({ type: 'error', text1: 'Não foi possível remover.' });
    }
  };

  const handleLoadMore = () => {
    if (!pagination) return;
    if (pagination.page < pagination.totalPages) {
      loadPage(pagination.page + 1, true);
    }
  };

  return (
    <View className="gap-4 mt-6">
      <Text className="text-lg font-semibold text-foreground">
        Comentários
      </Text>

      {isAuthenticated ? (
        <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      ) : (
        <View className="rounded-xl border border-border bg-surface-container p-4">
          <Text className="text-sm text-muted">
            Faça login para comentar.
          </Text>
        </View>
      )}

      {isLoading ? (
        <Loader />
      ) : comments.length === 0 ? (
        <Text className="text-sm text-muted">
          Nenhum comentário ainda. Seja o primeiro!
        </Text>
      ) : (
        <View className="gap-3">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} onDelete={handleDelete} />
          ))}
          {pagination && pagination.page < pagination.totalPages ? (
            <Button
              title="Carregar mais"
              onPress={handleLoadMore}
              variant="outline"
            />
          ) : null}
        </View>
      )}
    </View>
  );
}
