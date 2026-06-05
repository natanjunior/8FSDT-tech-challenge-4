import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">
            Blog FIAP
          </Text>
          <Text className="text-base text-muted">
            Conteúdo educacional compartilhado por professores da rede.
          </Text>
        </View>

        <Card>
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground">
              Em construção
            </Text>
            <Text className="text-sm text-muted leading-5">
              A lista de posts entra aqui na Fase 2. Por enquanto, esta tela serve para confirmar que o app abre direto na home pública — sem login wall.
            </Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
