import React from 'react';
import { Text, View } from 'react-native';
import { Spinner } from '@/components/ui/Spinner';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loader({ message, fullScreen = false }: LoaderProps) {
  return (
    <View
      className={`items-center justify-center gap-3 ${
        fullScreen ? 'flex-1 bg-background' : 'py-6'
      }`}
    >
      <Spinner size="md" />
      {message ? (
        <Text className="font-sans-medium text-sm text-muted">{message}</Text>
      ) : null}
    </View>
  );
}
