import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { MarkAsReadButton } from '@/components/posts/MarkAsReadButton';
import { getPostById } from '@/services/posts.service';
import { hasReadPost } from '@/services/reads.service';
import type { Post } from '@/types/api';
import type {
  RootStackNavigationProp,
  PostDetailRouteProp,
} from '@/navigation/types';

export function PostDetailScreen() {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, isAuthenticated } = useAuth();
  const isTeacher = user?.role === 'TEACHER';

  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [hasRead, setHasRead] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [fetched, readState] = await Promise.all([
          getPostById(postId),
          isAuthenticated ? hasReadPost(postId) : Promise.resolve(false),
        ]);
        if (cancelled) return;
        if (fetched.status !== 'PUBLISHED' && !isTeacher) {
          navigation.replace('Home');
          return;
        }
        setPost(fetched);
        setHasRead(readState);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId, isAuthenticated, isTeacher, navigation]);

  if (isLoading) return <Loader />;

  if (notFound || !post) {
    return (
      <EmptyState
        title="Post não encontrado"
        action={{ label: 'Voltar', onPress: () => navigation.replace('Home') }}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <View className="flex-row items-center gap-2">
          {post.discipline ? (
            <Badge label={post.discipline.label} variant="info" />
          ) : null}
          <Badge
            label={post.status}
            variant={
              post.status === 'PUBLISHED'
                ? 'success'
                : post.status === 'DRAFT'
                ? 'warning'
                : 'neutral'
            }
          />
        </View>

        <Text className="text-3xl font-bold text-foreground">
          {post.title}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-muted">
            {post.author?.name ?? 'Autor removido'}
            {post.author?.pronouns ? ` (${post.author.pronouns})` : ''}
          </Text>
          <Text className="text-xs text-muted">
            {post.comments_count} comentários · {post.reads_count} leituras
          </Text>
        </View>

        <Text className="text-base text-foreground leading-6">
          {post.content}
        </Text>

        <View className="mt-2">
          <MarkAsReadButton postId={post.id} initialHasRead={hasRead} />
        </View>
      </View>
    </ScrollView>
  );
}
