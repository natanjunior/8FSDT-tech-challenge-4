import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { DisciplineBadge } from '@/components/ui/DisciplineBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { IconCount } from '@/components/ui/IconCount';
import { AuthorId } from '@/components/ui/AuthorId';
import { MarkdownContent } from '@/components/ui/MarkdownContent';
import { MarkAsReadButton } from '@/components/posts/MarkAsReadButton';
import { CommentSection } from '@/features/comments/components/CommentSection';
import { getPostById } from '@/services/posts.service';
import { hasReadPost } from '@/services/reads.service';
import type { Post } from '@/types/api';
import type {
  RootStackNavigationProp,
  PostDetailRouteProp,
} from '@/navigation/types';

function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();
}

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

  // Recarrega ao focar a tela (não só na montagem): ao voltar de PostEdit o
  // conteúdo e os contadores refletem o estado atual, sem precisar remontar.
  useFocusEffect(
    useCallback(() => {
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
    }, [postId, isAuthenticated, isTeacher, navigation])
  );

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
      <View className="p-4 gap-5">
        <View className="flex-row flex-wrap items-center gap-3">
          <DisciplineBadge label={post.discipline?.label ?? null} />
          <StatusBadge status={post.status} />
          <IconCount type="comment" count={post.comments_count} size="md" />
          <IconCount type="bookmark" count={post.reads_count} size="md" />
        </View>

        <Text className="font-jetbrains text-[11px] uppercase tracking-tighter text-outline">
          {formatLongDate(post.published_at ?? post.created_at)}
        </Text>

        <Text className="font-sans-black text-3xl text-primary leading-tight">
          {post.title}
        </Text>

        <AuthorId
          name={post.author?.name}
          subtitle={post.author?.pronouns ?? post.discipline?.label ?? undefined}
          date={formatLongDate(post.published_at ?? post.created_at)}
          size="lg"
        />

        <View className="mt-3">
          <MarkdownContent value={post.content} />
        </View>

        <View className="mt-2 gap-3">
          <MarkAsReadButton
            postId={post.id}
            initialHasRead={hasRead}
            onMarked={() =>
              setPost((prev) =>
                prev ? { ...prev, reads_count: prev.reads_count + 1 } : prev
              )
            }
          />
          {isTeacher ? (
            <Button
              title="Editar post"
              variant="secondary"
              leadingIcon="pencil-outline"
              onPress={() => navigation.navigate('PostEdit', { postId: post.id })}
            />
          ) : null}
        </View>

        <CommentSection postId={post.id} />
      </View>
    </ScrollView>
  );
}
