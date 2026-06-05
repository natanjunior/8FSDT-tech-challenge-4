import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderRight } from '@/components/layout/Header';
import { HomeScreen } from '@/screens/HomeScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { AdminStub } from '@/screens/AdminStub';
import { Loader } from '@/components/ui/Loader';
import { colors } from '@/theme/colors';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
  },
};

export function AppRoutes() {
  const { isHydrating } = useAuth();

  if (isHydrating) {
    return <Loader fullScreen message="Carregando sessão..." />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.primaryForeground,
          headerTitleStyle: { fontWeight: '600' },
          headerRight: () => <HeaderRight />,
        }}
      >
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '8FSDT — Fase 4' }}
        />
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="AdminStub"
          component={AdminStub}
          options={{ title: 'Painel admin' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
