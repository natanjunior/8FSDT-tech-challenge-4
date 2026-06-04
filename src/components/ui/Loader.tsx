import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loader({ message, fullScreen = false }: LoaderProps) {
  return (
    <View
      className={`items-center justify-center gap-2 ${fullScreen ? 'flex-1 bg-background' : 'py-4'}`}
    >
      <ActivityIndicator color={colors.primary} />
      {message ? (
        <Text className="text-sm text-muted">{message}</Text>
      ) : null}
    </View>
  );
}
