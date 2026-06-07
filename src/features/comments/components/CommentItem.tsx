import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import type { Comment } from '@/types/api';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const displayName = comment.author?.name ?? 'Autor removido';
  const authorType = comment.author?.type;
  return (
    <Card>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-semibold text-foreground">
              {displayName}
            </Text>
            {authorType ? (
              <Text className="text-xs text-muted">
                · {authorType === 'Teacher' ? 'Professor' : 'Aluno'}
              </Text>
            ) : null}
          </View>
          {comment.can_delete && onDelete ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => onDelete(comment.id)}
            >
              <Text className="text-xs font-medium text-error">Excluir</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <Text className="text-sm text-foreground leading-5">
          {comment.content}
        </Text>
      </View>
    </Card>
  );
}
