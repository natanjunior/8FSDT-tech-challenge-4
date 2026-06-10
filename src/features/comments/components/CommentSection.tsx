import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Icon } from '@/components/ui/Icon';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import {
  listComments,
  createComment,
  deleteComment,
} from '@/services/comments.service';
import { softShadow } from '@/theme/elevation';
import { colors } from '@/theme/colors';
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

  const total = pagination?.total ?? 0;

  return (
    <View className="mt-8">
      <View
        className="overflow-hidden rounded-xl bg-surface-container-lowest"
        style={softShadow}
      >
        {/* Header bar */}
        <View className="flex-row items-center justify-between bg-surface-container px-6 py-4 border-b border-surface-container-high">
          <View className="flex-row items-center gap-2">
            <Icon name="forum" size={18} color={colors.primary} />
            <Text className="font-sans-bold text-sm text-primary">Comentários</Text>
          </View>
          <Text className="font-jetbrains text-xs text-muted">
            {total} {total === 1 ? 'comentário' : 'comentários'}
          </Text>
        </View>

        {/* Body */}
        <View className="p-6 gap-6">
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
            <View className="items-center py-4">
              <Spinner size="md" />
            </View>
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
                  variant="secondary"
                />
              ) : null}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
