import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { Loader } from '@/components/ui/Loader';
import { colors } from '@/theme/colors';
import type { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.primaryForeground,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '8FSDT — Fase 4' }}
      />
    </AppStack.Navigator>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
  },
};

export function AppRoutes() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return <Loader fullScreen message="Carregando sessão..." />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
