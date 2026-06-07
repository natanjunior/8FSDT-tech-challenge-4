import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackNavigationProp } from '@/navigation/types';

export function HeaderRight() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isAuthenticated, user, logout } = useAuth();

  const grupoButton = (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => navigation.navigate('Grupo')}
      className="px-3 py-1"
    >
      <Text className="text-sm font-semibold text-primary-foreground">
        Grupo
      </Text>
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <View className="flex-row items-center gap-2">
        {grupoButton}
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}
          className="px-3 py-1"
        >
          <Text className="text-sm font-semibold text-primary-foreground">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isTeacher = user?.role === 'TEACHER';

  return (
    <View className="flex-row items-center gap-2">
      {grupoButton}
      {isTeacher ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.navigate('AdminStub')}
          className="px-3 py-1"
        >
          <Text className="text-sm font-semibold text-primary-foreground">
            Painel
          </Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        accessibilityRole="button"
        onPress={logout}
        className="px-3 py-1"
      >
        <Text className="text-sm font-semibold text-primary-foreground">
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}
