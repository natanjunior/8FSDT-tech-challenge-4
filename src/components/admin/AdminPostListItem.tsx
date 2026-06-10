import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DisciplineBadge } from '@/components/ui/DisciplineBadge';
import { AuthorId } from '@/components/ui/AuthorId';
import { IconCount } from '@/components/ui/IconCount';
import { colors } from '@/theme/colors';
import type { Post } from '@/types/api';

interface AdminPostListItemProps {
  post: Post;
  onPressItem: (post: Post) => void;
  onPressEdit: (post: Post) => void;
  onPressDelete: (post: Post) => void;
  testID?: string;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

export function AdminPostListItem({
  post,
  onPressItem,
  onPressEdit,
  onPressDelete,
  testID,
}: AdminPostListItemProps) {
  return (
    <Card>
      <View className="gap-3">
        {/* Linha 1: título + ações */}
        <View className="flex-row items-start gap-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPressItem(post)}
            testID={testID ? `${testID}-content` : undefined}
            className="flex-1"
          >
            <Text
              className="font-sans-extrabold text-lg text-primary leading-tight"
              numberOfLines={2}
            >
              {post.title}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Editar post"
              testID={testID ? `${testID}-edit-btn` : undefined}
              onPress={() => onPressEdit(post)}
              hitSlop={8}
              className="h-9 w-9 items-center justify-center rounded-lg"
            >
              <Icon name="pencil-outline" size={18} color={colors.outline} />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Excluir post"
              testID={testID ? `${testID}-delete-btn` : undefined}
              onPress={() => onPressDelete(post)}
              hitSlop={8}
              className="h-9 w-9 items-center justify-center rounded-lg"
            >
              <Icon name="trash-can-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Linha 2: badges */}
        <View className="flex-row items-center gap-2">
          <DisciplineBadge label={post.discipline?.label ?? null} />
          <StatusBadge status={post.status} />
        </View>

        {/* Linha 3: autor + contadores */}
        <View className="flex-row items-center justify-between">
          <AuthorId
            name={post.author?.name}
            subtitle={post.discipline?.label ?? 'Sem disciplina'}
            size="sm"
          />
          <View className="flex-row items-center gap-3">
            <IconCount type="comment" count={post.comments_count} />
            <IconCount type="bookmark" count={post.reads_count} />
          </View>
        </View>

        {/* Linha 4: updated_at */}
        <Text className="font-jetbrains text-[10px] uppercase tracking-tighter text-outline">
          ATUALIZADO {formatDate(post.updated_at)}
        </Text>
      </View>
    </Card>
  );
}
