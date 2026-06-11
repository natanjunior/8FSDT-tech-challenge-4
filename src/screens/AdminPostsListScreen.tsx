import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireRole } from '@/hooks/useRequireRole';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { AdminPostListItem } from '@/components/admin/AdminPostListItem';
import { searchPosts, deletePost } from '@/services/posts.service';
import { colors } from '@/theme/colors';
import type { Post } from '@/types/api';
import type { RootStackNavigationProp } from '@/navigation/types';

export function AdminPostsListScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const { logout } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean) => {
      try {
        const res = await searchPosts({ page: targetPage, limit: 10 });
        setPosts((prev) => (append ? [...prev, ...res.data] : res.data));
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          await logout();
          navigation.replace('Login');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro ao carregar posts',
            text2: err?.response?.data?.error ?? 'Tente novamente.',
          });
        }
      }
    },
    [logout, navigation]
  );

  useEffect(() => {
    if (!allowed) return;
    setIsLoading(true);
    fetchPage(1, false).finally(() => setIsLoading(false));
  }, [allowed, fetchPage]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPage(1, false);
    setIsRefreshing(false);
  }, [fetchPage]);

  const onLoadMore = useCallback(async () => {
    if (isLoadingMore || page >= totalPages) return;
    setIsLoadingMore(true);
    await fetchPage(page + 1, true);
    setIsLoadingMore(false);
  }, [fetchPage, isLoadingMore, page, totalPages]);

  const onConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deletePost(pendingDelete.id);
      Toast.show({ type: 'success', text1: 'Post excluído.' });
      setPendingDelete(null);
      await fetchPage(1, false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        Toast.show({ type: 'error', text1: 'Sessão expirada' });
        await logout();
        navigation.replace('Login');
      } else if (status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Sem permissão',
          text2: 'Apenas professores podem excluir.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao excluir',
          text2: err?.response?.data?.error ?? 'Tente novamente.',
        });
      }
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, fetchPage, logout, navigation]);

  if (!allowed) return null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-row items-center justify-between px-4 pb-3 pt-4">
        <View className="flex-row items-center gap-2">
          <Icon name="view-dashboard-outline" size={22} color={colors.primary} />
          <Text className="font-sans-black text-xl text-primary">
            Painel admin
          </Text>
        </View>
        <Button
          title="Novo post"
          leadingIcon="plus"
          size="sm"
          onPress={() => navigation.navigate('PostCreate')}
        />
      </View>

      {isLoading ? (
        <Loader fullScreen message="Carregando posts..." />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <AdminPostListItem
              post={item}
              testID={`admin-post-${item.id}`}
              onPressItem={(p) =>
                navigation.navigate('PostDetail', { postId: p.id, title: p.title })
              }
              onPressEdit={(p) =>
                navigation.navigate('PostEdit', { postId: p.id })
              }
              onPressDelete={(p) => setPendingDelete(p)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="inbox-outline"
              title="Nenhum post encontrado"
              subtitle="Crie um novo post pelo botão acima."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? <Loader message="Carregando mais..." /> : null
          }
        />
      )}

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Excluir post?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" será excluído permanentemente, incluindo comentários e marcações de leitura.`
            : ''
        }
        confirmLabel="Excluir permanentemente"
        cancelLabel="Cancelar"
        variant="destructive"
        onConfirm={onConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}
