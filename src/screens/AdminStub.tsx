import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRequireRole } from '@/hooks/useRequireRole';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';
import type { RootStackNavigationProp } from '@/navigation/types';

export function AdminStub() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  if (!allowed) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-6">
        <View className="flex-row items-center gap-3">
          <Icon name="view-dashboard-outline" size={28} color={colors.primary} />
          <Text className="font-sans-black text-2xl text-primary">
            Painel admin
          </Text>
        </View>
        <Text className="font-sans text-base text-muted leading-6">
          Em construção — a Fase 4 vai substituir esta tela pela lista administrativa de posts.
        </Text>

        <Button
          title="Novo post"
          leadingIcon="plus"
          onPress={() => navigation.navigate('PostCreate')}
        />
      </View>
    </SafeAreaView>
  );
}
