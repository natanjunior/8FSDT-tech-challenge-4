import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, IconName } from '@/components/ui/Icon';
import { AuthorId } from '@/components/ui/AuthorId';
import { colors } from '@/theme/colors';
import type { RootStackNavigationProp } from '@/navigation/types';

interface HeaderItemProps {
  icon: IconName;
  iconTestID: string;
  label: string;
  onPress: () => void;
}

function HeaderItem({ icon, iconTestID, label, onPress }: HeaderItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-1 px-2 py-1.5 rounded-lg"
    >
      <View testID={iconTestID}>
        <Icon name={icon} size={16} color={colors.primaryForeground} />
      </View>
      <Text className="font-sans-bold text-sm text-primary-foreground">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function HeaderRight() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isAuthenticated, user, profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const grupoButton = (
    <HeaderItem
      icon="account-group"
      iconTestID="header-grupo-icon"
      label="Grupo"
      onPress={() => navigation.navigate('Grupo')}
    />
  );

  if (!isAuthenticated) {
    return (
      <View className="flex-row items-center gap-1 pr-2">
        {grupoButton}
        <HeaderItem
          icon="login"
          iconTestID="header-login-icon"
          label="Entrar"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    );
  }

  const isTeacher = user?.role === 'TEACHER';
  const displayName = profile?.name ?? user?.login ?? '';

  return (
    <>
      <View className="flex-row items-center gap-2 pr-2">
        {grupoButton}
        <TouchableOpacity
          testID="header-user-trigger"
          accessibilityRole="button"
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.7}
          className="flex-row items-center gap-2 rounded-lg px-2 py-1"
        >
          <AuthorId
            name={displayName}
            subtitle={isTeacher ? 'Professor' : 'Aluno'}
            size="sm"
          />
          <Icon
            name="chevron-down"
            size={16}
            color={colors.primaryForeground}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={menuOpen}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          onPress={() => setMenuOpen(false)}
          className="flex-1 bg-foreground/20"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="absolute right-3 top-14 w-48 overflow-hidden rounded-xl bg-surface-container-lowest"
            style={{
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {isTeacher ? (
              <TouchableOpacity
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate('AdminStub');
                }}
                className="flex-row items-center gap-3 px-4 py-3"
              >
                <Icon name="view-dashboard" size={18} color={colors.outline} />
                <Text className="font-sans-medium text-sm text-primary">
                  Painel
                </Text>
              </TouchableOpacity>
            ) : null}
            <View className="h-px bg-outline-variant/40" />
            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <Icon name="logout" size={18} color={colors.error} />
              <Text className="font-sans-medium text-sm text-error">Sair</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
