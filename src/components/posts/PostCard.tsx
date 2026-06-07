import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Post, PostStatus } from '@/types/api';

interface PostCardProps {
  post: Post;
  onPress: (post: Post) => void;
}

const STATUS_VARIANT: Record<PostStatus, 'success' | 'warning' | 'neutral'> = {
  PUBLISHED: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'neutral',
};

export function PostCard({ post, onPress }: PostCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(post)}
      accessibilityRole="button"
    >
      <Card>
        <View className="gap-3">
          <View className="flex-row items-start justify-between gap-2">
            <Text
              className="flex-1 text-lg font-semibold text-foreground"
              numberOfLines={2}
            >
              {post.title}
            </Text>
            <Badge
              label={post.status}
              variant={STATUS_VARIANT[post.status]}
            />
          </View>

          <Text className="text-sm text-muted" numberOfLines={3}>
            {post.content}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">
              {post.author?.name ?? 'Autor removido'}
            </Text>
            <Badge
              label={post.discipline?.label ?? 'Sem disciplina'}
              variant="info"
            />
          </View>

          <View className="flex-row gap-4">
            <Text className="text-xs text-muted">
              {post.comments_count}{' '}
              {post.comments_count === 1 ? 'comentário' : 'comentários'}
            </Text>
            <Text className="text-xs text-muted">
              {post.reads_count}{' '}
              {post.reads_count === 1 ? 'leitura' : 'leituras'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
