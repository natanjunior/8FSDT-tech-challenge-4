import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
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
import { SearchBar } from '@/components/posts/SearchBar';
import { DisciplineChips } from '@/components/posts/DisciplineChips';
import { searchPosts, deletePost } from '@/services/posts.service';
import { listDisciplines } from '@/services/disciplines.service';
import { colors } from '@/theme/colors';
import type { Discipline, Post, PostStatus } from '@/types/api';
import type { RootStackNavigationProp } from '@/navigation/types';

const STATUS_OPTIONS: Array<{ value: PostStatus | null; label: string; dot: string }> = [
  { value: null, label: 'TODOS', dot: 'bg-outline' },
  { value: 'DRAFT', label: 'RASCUNHO', dot: 'bg-status-draft' },
  { value: 'PUBLISHED', label: 'PUBLICADO', dot: 'bg-status-published' },
  { value: 'ARCHIVED', label: 'ARQUIVADO', dot: 'bg-status-archived' },
];

function AdminStatusFilter({
  value,
  onChange,
}: {
  value: PostStatus | null;
  onChange: (next: PostStatus | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
    >
      {STATUS_OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.label}
            accessibilityRole="button"
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${
              selected ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <View className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
            <Text
              className={`font-sans-bold text-[10px] uppercase tracking-wider ${
                selected ? 'text-primary-foreground' : 'text-foreground'
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

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

  const [statusFilter, setStatusFilter] = useState<PostStatus | null>(null);
  const [disciplineFilter, setDisciplineFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  const fetchPosts = useCallback(
    (nextPage: number) =>
      searchPosts({
        page: nextPage,
        limit: 10,
        ...(query ? { query } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(disciplineFilter ? { discipline: disciplineFilter } : {}),
      }),
    [query, statusFilter, disciplineFilter]
  );

  const loadPage = useCallback(
    async (nextPage: number, mode: 'replace' | 'append' | 'refresh') => {
      try {
        if (mode === 'append') setIsLoadingMore(true);
        else if (mode === 'refresh') setIsRefreshing(true);
        else setIsLoading(true);
        const res = await fetchPosts(nextPage);
        setPosts((prev) => (mode === 'append' ? [...prev, ...res.data] : res.data));
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
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [fetchPosts, logout, navigation]
  );

  useEffect(() => {
    if (!allowed) return;
    loadPage(1, 'replace');
  }, [allowed, loadPage]);

  useEffect(() => {
    if (!allowed) return;
    listDisciplines().then(setDisciplines);
  }, [allowed]);

  const onRefresh = useCallback(() => {
    loadPage(1, 'refresh');
  }, [loadPage]);

  const onLoadMore = useCallback(() => {
    if (isLoadingMore || page >= totalPages) return;
    loadPage(page + 1, 'append');
  }, [loadPage, isLoadingMore, page, totalPages]);

  const onConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deletePost(pendingDelete.id);
      Toast.show({ type: 'success', text1: 'Post excluído.' });
      setPendingDelete(null);
      await loadPage(1, 'replace');
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
  }, [pendingDelete, loadPage, logout, navigation]);

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

      <View className="gap-3 pb-3">
        <View className="px-4">
          <SearchBar value={query} onDebouncedChange={setQuery} />
        </View>
        <AdminStatusFilter value={statusFilter} onChange={setStatusFilter} />
        <DisciplineChips
          disciplines={disciplines}
          selectedId={disciplineFilter}
          onSelect={(id) => setDisciplineFilter(id ?? null)}
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
