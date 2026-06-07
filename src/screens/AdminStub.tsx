import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useRequireRole } from '@/hooks/useRequireRole';

export function AdminStub() {
  const allowed = useRequireRole('TEACHER');
  if (!allowed) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-6">
        <Text className="text-2xl font-bold text-foreground">
          Painel admin — em construção
        </Text>
        <Text className="text-base text-muted leading-6">
          Esta é uma tela placeholder para validar o role gate. A Fase 4 vai substituir esta tela pela lista administrativa de posts.
        </Text>
      </View>
    </SafeAreaView>
  );
}
