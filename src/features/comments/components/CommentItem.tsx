import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthorAvatar } from '@/components/ui/AuthorAvatar';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';
import type { Comment } from '@/types/api';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: string) => void;
  testID?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
}

export function CommentItem({ comment, onDelete, testID }: CommentItemProps) {
  const displayName = comment.author?.name ?? 'Autor removido';
  const authorType = comment.author?.type;

  return (
    <View className="flex-row gap-3" testID={testID}>
      <View testID={testID ? `${testID}-avatar-icon` : undefined}>
        <AuthorAvatar name={comment.author?.name} variant="icon" size="md" />
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text className="font-sans-bold text-sm text-primary">
            {displayName}
          </Text>
          {authorType ? (
            <Text className="font-sans text-[10px] text-outline">
              · {authorType === 'Teacher' ? 'Professor' : 'Aluno'}
            </Text>
          ) : null}
        </View>

        <Text className="font-sans text-sm text-foreground leading-5">
          {comment.content}
        </Text>

        <View className="mt-1 flex-row items-center justify-end gap-3">
          <Text className="font-jetbrains text-[11px] text-muted">
            {formatDate(comment.created_at)}
          </Text>
          {comment.can_delete && onDelete ? (
            <TouchableOpacity
              accessibilityRole="button"
              testID={testID ? `${testID}-delete-icon` : undefined}
              onPress={() => onDelete(comment.id)}
              hitSlop={8}
            >
              <Icon name="trash-can-outline" size={16} color={colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
