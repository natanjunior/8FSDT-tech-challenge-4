import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DisciplineBadge } from '@/components/ui/DisciplineBadge';
import { AuthorId } from '@/components/ui/AuthorId';
import { IconCount } from '@/components/ui/IconCount';
import type { Post } from '@/types/api';
import { stripMarkdown } from '@/lib/markdown';

interface PostCardProps {
  post: Post;
  onPress: (post: Post) => void;
  testID?: string;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function getExcerpt(content: string, maxLength = 140): string {
  const clean = stripMarkdown(content);
  return clean.length > maxLength ? clean.slice(0, maxLength) + '…' : clean;
}

export function PostCard({ post, onPress, testID }: PostCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(post)}
      accessibilityRole="button"
      testID={testID}
    >
      <View className="relative pt-3">
        {/* Discipline badge — flutuante */}
        <View className="absolute left-6 top-0 z-10">
          <DisciplineBadge label={post.discipline?.label ?? null} />
        </View>

        <Card>
          <View className="gap-4 pt-3">
            {/* Top — status + data */}
            <View className="flex-row items-center justify-between">
              <StatusBadge status={post.status} />
              <Text className="font-jetbrains text-[10px] uppercase tracking-tighter text-outline">
                {formatDate(post.published_at ?? post.created_at)}
              </Text>
            </View>

            {/* Título */}
            <Text
              className="font-sans-extrabold text-xl text-primary leading-tight"
              numberOfLines={3}
            >
              {post.title}
            </Text>

            {/* Excerpt */}
            <Text className="font-sans text-sm text-muted leading-relaxed" numberOfLines={3}>
              {getExcerpt(post.content)}
            </Text>

            {/* Footer com ghost border */}
            <View
              className="flex-row items-center justify-between pt-4"
              style={styles.ghostBorder}
            >
              <AuthorId
                name={post.author?.name}
                subtitle={post.discipline?.label ?? 'Sem disciplina'}
                size="md"
              />
              <View className="flex-row items-center gap-3">
                <IconCount type="comment" count={post.comments_count} />
                <IconCount type="bookmark" count={post.reads_count} />
              </View>
            </View>
          </View>
        </Card>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ghostBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(196, 198, 207, 0.4)', // outline-variant @ 40%
  },
});
