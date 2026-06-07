import React from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  commentSchema,
  CommentFormData,
} from '@/features/comments/validators/comment.schema';

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function CommentForm({ onSubmit, isSubmitting = false }: CommentFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  const submit = async (data: CommentFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <View className="gap-3">
      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Comentário"
            placeholder="Escreva sua opinião..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.content?.message}
            multiline
          />
        )}
      />
      <Button
        title="Publicar comentário"
        onPress={handleSubmit(submit)}
        loading={isSubmitting}
      />
    </View>
  );
}
