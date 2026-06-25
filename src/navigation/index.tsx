import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderRight } from '@/components/layout/Header';
import { HomeScreen } from '@/screens/HomeScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { AdminPostsListScreen } from '@/screens/AdminPostsListScreen';
import { PostDetailScreen } from '@/screens/PostDetailScreen';
import { GrupoScreen } from '@/features/grupo/GrupoScreen';
import { PostCreateScreen } from '@/screens/PostCreateScreen';
import { PostEditScreen } from '@/screens/PostEditScreen';
import { TeachersListScreen } from '@/screens/TeachersListScreen';
import { TeacherCreateScreen } from '@/screens/TeacherCreateScreen';
import { TeacherEditScreen } from '@/screens/TeacherEditScreen';
import { StudentsListScreen } from '@/screens/StudentsListScreen';
import { StudentCreateScreen } from '@/screens/StudentCreateScreen';
import { StudentEditScreen } from '@/screens/StudentEditScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ProfileEditScreen } from '@/screens/ProfileEditScreen';
import { ChangePasswordScreen } from '@/screens/ChangePasswordScreen';
import { SignupScreen } from '@/screens/SignupScreen';
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
          headerStyle: { backgroundColor: 'transparent' },
          headerBackground: () => (
            <BlurView
              intensity={60}
              tint="dark"
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary + 'E6' }]}
            />
          ),
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
          name="AdminPosts"
          component={AdminPostsListScreen}
          options={{ title: 'Painel admin' }}
        />
        <RootStack.Screen
          name="PostDetail"
          component={PostDetailScreen}
          options={({ route }) => ({
            title: route.params.title ? route.params.title.slice(0, 30) : 'Post',
          })}
        />
        <RootStack.Screen
          name="Grupo"
          component={GrupoScreen}
          options={{ title: 'Grupo 28' }}
        />
        <RootStack.Screen
          name="PostCreate"
          component={PostCreateScreen}
          options={{ title: 'Novo post' }}
        />
        <RootStack.Screen
          name="PostEdit"
          component={PostEditScreen}
          options={{ title: 'Editar post' }}
        />
        <RootStack.Screen
          name="TeachersList"
          component={TeachersListScreen}
          options={{ title: 'Professores' }}
        />
        <RootStack.Screen
          name="TeacherCreate"
          component={TeacherCreateScreen}
          options={{ title: 'Novo professor' }}
        />
        <RootStack.Screen
          name="TeacherEdit"
          component={TeacherEditScreen}
          options={{ title: 'Editar professor' }}
        />
        <RootStack.Screen
          name="StudentsList"
          component={StudentsListScreen}
          options={{ title: 'Alunos' }}
        />
        <RootStack.Screen
          name="StudentCreate"
          component={StudentCreateScreen}
          options={{ title: 'Novo aluno' }}
        />
        <RootStack.Screen
          name="StudentEdit"
          component={StudentEditScreen}
          options={{ title: 'Editar aluno' }}
        />
        <RootStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Meu perfil' }}
        />
        <RootStack.Screen
          name="ProfileEdit"
          component={ProfileEditScreen}
          options={{ title: 'Editar perfil' }}
        />
        <RootStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ title: 'Trocar senha' }}
        />
        <RootStack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Cadastro' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
