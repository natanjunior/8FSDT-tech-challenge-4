import React, { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackNavigationProp } from '@/navigation/types';

export function AdminStub() {
  const { user } = useAuth();
  const navigation = useNavigation<RootStackNavigationProp>();
  const isTeacher = user?.role === 'TEACHER';

  useEffect(() => {
    if (!isTeacher) {
      Toast.show({
        type: 'info',
        text1: 'Acesso restrito',
        text2: 'Esta área é exclusiva para professores.',
      });
      navigation.replace('Home');
    }
  }, [isTeacher, navigation]);

  if (!isTeacher) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-6 p-6">
        <Text className="text-2xl font-bold text-foreground">
          Painel admin — em construção
        </Text>
        <Text className="text-base text-muted leading-6">
          Esta é uma tela placeholder para validar o role gate. A Fase 4 vai substituir esta tela pela lista administrativa de posts (req 9 do enunciado).
        </Text>
      </View>
    </SafeAreaView>
  );
}
