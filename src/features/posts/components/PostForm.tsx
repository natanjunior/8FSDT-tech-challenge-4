import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  postSchema,
  PostFormData,
  PostFormInput,
} from '@/features/posts/validators/post.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusPicker } from '@/components/posts/StatusPicker';
import { DisciplineChips } from '@/components/posts/DisciplineChips';
import { MarkdownField } from '@/features/posts/components/MarkdownField';
import { listDisciplines } from '@/services/disciplines.service';
import type { Discipline } from '@/types/api';

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export function PostForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: PostFormProps) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    listDisciplines().then(setDisciplines);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormInput, unknown, PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'DRAFT',
      discipline_id: undefined,
      ...defaultValues,
    },
  });

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Título"
            placeholder="Ex: Introdução à Álgebra Linear"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <MarkdownField
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.content?.message}
          />
        )}
      />

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Status</Text>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <StatusPicker value={value} onChange={onChange} />
          )}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Disciplina</Text>
        <Controller
          control={control}
          name="discipline_id"
          render={({ field: { onChange, value } }) => (
            <DisciplineChips
              disciplines={disciplines}
              selectedId={value ?? null}
              onSelect={(id) => onChange(id ?? undefined)}
            />
          )}
        />
        {errors.discipline_id ? (
          <Text className="text-sm text-error">
            {errors.discipline_id.message}
          </Text>
        ) : null}
      </View>

      <Button
        title={submitLabel}
        onPress={handleSubmit((data) => onSubmit(data))}
        loading={isSubmitting}
      />
    </View>
  );
}
