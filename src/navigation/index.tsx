import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DrawerActions,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderRight } from '@/components/layout/Header';
import { Icon } from '@/components/ui/Icon';
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
import { AppDrawerContent } from '@/navigation/AppDrawerContent';
import { colors } from '@/theme/colors';
import type { RootStackParamList, RootDrawerParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootDrawer = createDrawerNavigator<RootDrawerParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
  },
};

// Botão hamburger — usado só nas telas-destino do drawer.
function DrawerToggle({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Abrir menu"
      onPress={onPress}
      className="pl-2 pr-1 py-1"
    >
      <Icon name="menu" size={22} color={colors.primaryForeground} />
    </TouchableOpacity>
  );
}

// options() que injeta o hamburger no headerLeft de uma tela-destino.
const withDrawerToggle =
  (title: string) =>
  ({ navigation }: { navigation: { dispatch: (a: any) => void } }): NativeStackNavigationOptions => ({
    title,
    headerLeft: () => (
      <DrawerToggle onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
    ),
  });

function RootStackNavigator() {
  return (
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
      {/* --- telas-destino do drawer: ganham hamburger --- */}
      <RootStack.Screen
        name="Home"
        component={HomeScreen}
        options={withDrawerToggle('TC4')}
      />
      <RootStack.Screen
        name="AdminPosts"
        component={AdminPostsListScreen}
        options={withDrawerToggle('Painel admin')}
      />
      <RootStack.Screen
        name="Grupo"
        component={GrupoScreen}
        options={withDrawerToggle('Grupo 28')}
      />
      <RootStack.Screen
        name="TeachersList"
        component={TeachersListScreen}
        options={withDrawerToggle('Professores')}
      />
      <RootStack.Screen
        name="StudentsList"
        component={StudentsListScreen}
        options={withDrawerToggle('Alunos')}
      />

      {/* --- telas "filhas": mantêm o botão voltar nativo --- */}
      <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={({ route }) => ({
          title: route.params.title ? route.params.title.slice(0, 30) : 'Post',
        })}
      />
      <RootStack.Screen name="PostCreate" component={PostCreateScreen} options={{ title: 'Novo post' }} />
      <RootStack.Screen name="PostEdit" component={PostEditScreen} options={{ title: 'Editar post' }} />
      <RootStack.Screen name="TeacherCreate" component={TeacherCreateScreen} options={{ title: 'Novo professor' }} />
      <RootStack.Screen name="TeacherEdit" component={TeacherEditScreen} options={{ title: 'Editar professor' }} />
      <RootStack.Screen name="StudentCreate" component={StudentCreateScreen} options={{ title: 'Novo aluno' }} />
      <RootStack.Screen name="StudentEdit" component={StudentEditScreen} options={{ title: 'Editar aluno' }} />
      <RootStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu perfil' }} />
      <RootStack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ title: 'Editar perfil' }} />
      <RootStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Trocar senha' }} />
      <RootStack.Screen name="Signup" component={SignupScreen} options={{ title: 'Cadastro' }} />
    </RootStack.Navigator>
  );
}

export function AppRoutes() {
  const { isHydrating } = useAuth();

  if (isHydrating) {
    return <Loader fullScreen message="Carregando sessão..." />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootDrawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: { width: 288 },
        }}
        drawerContent={(props) => <AppDrawerContent {...props} />}
      >
        <RootDrawer.Screen name="Root" component={RootStackNavigator} />
      </RootDrawer.Navigator>
    </NavigationContainer>
  );
}
