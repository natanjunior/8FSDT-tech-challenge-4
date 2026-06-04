import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-6">
        <View className="gap-2">
          <Text className="text-2xl font-bold text-foreground">
            Olá, {user?.name}
          </Text>
          <Text className="text-base text-muted">
            Você está autenticado contra a API da Fase 2.
          </Text>
        </View>

        <Card>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">E-mail</Text>
              <Text className="text-sm font-medium text-foreground">
                {user?.email}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Perfil</Text>
              <Badge
                label={user?.role ?? '—'}
                variant={user?.role === 'TEACHER' ? 'info' : 'neutral'}
              />
            </View>
          </View>
        </Card>

        <View className="mt-auto">
          <Button title="Sair" onPress={logout} variant="outline" />
        </View>
      </View>
    </SafeAreaView>
  );
}
