import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Input } from '@/components/ui/Input';
import { MarkdownContent } from '@/components/ui/MarkdownContent';

interface MarkdownFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
}

const MIN_CHARS = 10;

function TabButton({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      className={`rounded-lg px-3 py-1.5 ${
        active ? 'bg-primary' : 'bg-surface-container-low'
      }`}
    >
      <Text
        className={`font-sans-medium text-sm ${
          active ? 'text-primary-foreground' : 'text-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function MarkdownField({
  value,
  onChangeText,
  onBlur,
  error,
}: MarkdownFieldProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const length = value?.length ?? 0;

  return (
    <View className="gap-2">
      <Text className="text-sm font-sans-bold text-primary">Conteúdo</Text>

      <View className="flex-row gap-2">
        <TabButton
          label="Escrever"
          active={tab === 'write'}
          onPress={() => setTab('write')}
          testID="md-tab-write"
        />
        <TabButton
          label="Prévia"
          active={tab === 'preview'}
          onPress={() => setTab('preview')}
          testID="md-tab-preview"
        />
      </View>

      {tab === 'write' ? (
        <Input
          placeholder="Escreva o conteúdo do post..."
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          multiline
          testID="md-input"
        />
      ) : value ? (
        <View className="rounded-xl bg-surface-container-low px-4 py-3">
          <MarkdownContent value={value} testID="md-preview" />
        </View>
      ) : (
        <View className="rounded-xl bg-surface-container-low px-4 py-6">
          <Text className="text-center font-sans text-sm text-muted">
            Nada para pré-visualizar
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <Text className="font-sans text-xs text-muted">Suporta Markdown</Text>
        <Text className="font-sans text-xs text-muted">
          {length} caracteres · mín. {MIN_CHARS}
        </Text>
      </View>

      {error ? (
        <Text testID="md-error" className="text-error text-sm font-sans-medium">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
