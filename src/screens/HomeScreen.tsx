import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SearchBar } from '@/components/posts/SearchBar';
import { ActiveFilterPill } from '@/components/posts/ActiveFilterPill';
import { PostCard } from '@/components/posts/PostCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { listPosts, searchPosts } from '@/services/posts.service';
import { colors } from '@/theme/colors';
import type { PaginatedResponse, Post } from '@/types/api';
import type { HomeRouteProp, RootStackNavigationProp } from '@/navigation/types';

export function HomeScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<HomeRouteProp>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [disciplineId, setDisciplineId] = useState<string | null>(
    route.params?.disciplineId ?? null
  );
  const [disciplineLabel, setDisciplineLabel] = useState<string | null>(
    route.params?.disciplineLabel ?? null
  );

  // Sincroniza o filtro quando o drawer muda o param (mesmo já estando na Home).
  useEffect(() => {
    setDisciplineId(route.params?.disciplineId ?? null);
    setDisciplineLabel(route.params?.disciplineLabel ?? null);
  }, [route.params?.disciplineId, route.params?.disciplineLabel]);

  const fetchPosts = useCallback(
    async (nextPage: number): Promise<PaginatedResponse<Post>> => {
      const hasFilters = !!query || !!disciplineId;
      return hasFilters
        ? searchPosts({
            query: query || undefined,
            discipline: disciplineId ?? undefined,
            page: nextPage,
          })
        : listPosts({ page: nextPage });
    },
    [query, disciplineId]
  );

  const loadPage = useCallback(
    async (nextPage: number, mode: 'replace' | 'append' | 'refresh') => {
      try {
        if (mode === 'append') setIsLoadingMore(true);
        else if (mode === 'refresh') setIsRefreshing(true);
        else setIsLoading(true);

        setError(null);
        const result = await fetchPosts(nextPage);
        setPosts((prev) => (mode === 'append' ? [...prev, ...result.data] : result.data));
        setPage(result.pagination.page);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar posts.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [fetchPosts]
  );

  // Recarrega ao focar a tela e quando a busca/disciplina muda (loadPage muda de
  // identidade). Ao voltar de PostDetail a lista reflete o estado atual sem
  // precisar remontar a Home.
  useFocusEffect(
    useCallback(() => {
      loadPage(1, 'replace');
    }, [loadPage])
  );

  const handleEndReached = () => {
    if (!isLoadingMore && page < totalPages) {
      loadPage(page + 1, 'append');
    }
  };

  const handleRefresh = () => loadPage(1, 'refresh');

  const handlePostPress = (post: Post) => {
    navigation.navigate('PostDetail', { postId: post.id, title: post.title });
  };

  const handleClearDiscipline = () => {
    navigation.setParams({ disciplineId: undefined, disciplineLabel: undefined });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="p-4 gap-3">
        <SearchBar value={query} onDebouncedChange={setQuery} />
        {disciplineId && disciplineLabel ? (
          <ActiveFilterPill label={disciplineLabel} onClear={handleClearDiscipline} />
        ) : null}
      </View>

      {isLoading ? (
        <View className="px-4 gap-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </View>
      ) : error ? (
        <EmptyState
          title="Erro ao carregar"
          subtitle={error}
          action={{ label: 'Tentar novamente', onPress: () => loadPage(1, 'replace') }}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard post={item} onPress={handlePostPress} />
          )}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="Nenhum post encontrado"
              subtitle={
                query || disciplineLabel
                  ? `Tente outra busca${disciplineLabel ? ` em ${disciplineLabel}` : ''}.`
                  : 'Volte mais tarde.'
              }
            />
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator color={colors.primary} />
                <Text className="text-xs text-muted mt-2">Carregando mais...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
