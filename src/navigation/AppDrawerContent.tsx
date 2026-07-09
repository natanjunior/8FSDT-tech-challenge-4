import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, IconName } from '@/components/ui/Icon';
import { AuthorId } from '@/components/ui/AuthorId';
import { listDisciplines } from '@/services/disciplines.service';
import { getDisciplineMeta } from '@/lib/disciplines';
import { colors } from '@/theme/colors';
import type { Discipline } from '@/types/api';
import type { RootStackParamList } from './types';

// primary-gradient navy (mesmo do Button variant="nav")
const NAVY_GRADIENT = ['#022448', '#1E3A5F'] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="px-4 pt-4 pb-1 font-sans-bold text-[11px] uppercase tracking-wider text-muted">
      {children}
    </Text>
  );
}

interface DrawerItemProps {
  icon: IconName;
  iconColor?: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}

function DrawerItem({ icon, iconColor, label, active, onPress }: DrawerItemProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center gap-3 px-4 py-3 rounded-lg ${
        active ? 'bg-primary/10' : ''
      }`}
    >
      <Icon name={icon} size={20} color={iconColor ?? colors.foreground} />
      <Text
        className={`text-sm ${
          active ? 'font-sans-bold text-primary' : 'font-sans-medium text-foreground'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { user, profile, isAuthenticated } = useAuth();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    listDisciplines().then(setDisciplines).catch(() => {});
  }, []);

  const isTeacher = user?.role === 'TEACHER';

  // disciplina ativa = param disciplineId da rota Home aninhada (best-effort)
  const rootRoute = props.state.routes[props.state.index];
  const nested = rootRoute?.state as
    | { index?: number; routes?: Array<{ name: string; params?: { disciplineId?: string } }> }
    | undefined;
  const focused = nested?.routes?.[nested.index ?? 0];
  const activeDisciplineId =
    focused?.name === 'Home' ? focused?.params?.disciplineId ?? null : null;

  const go = (screen: keyof RootStackParamList, params?: object) => {
    props.navigation.navigate('Root', { screen, params });
    props.navigation.closeDrawer();
  };

  const displayName = profile?.name ?? user?.login ?? '';

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-surface-container-lowest">
      <LinearGradient
        colors={NAVY_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pt-6 pb-5 gap-2"
      >
        <Text className="font-sans-black text-lg text-primary-foreground">
          TC4
        </Text>
        {isAuthenticated ? (
          <AuthorId
            name={displayName}
            subtitle={isTeacher ? 'Professor' : 'Aluno'}
            size="sm"
          />
        ) : null}
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SectionLabel>Navegação</SectionLabel>
        <DrawerItem
          icon="book-open-outline"
          label="Home"
          active={activeDisciplineId === null && focused?.name === 'Home'}
          onPress={() => go('Home', undefined)}
        />

        <SectionLabel>Disciplinas</SectionLabel>
        {disciplines.map((d) => {
          const meta = getDisciplineMeta(d.label);
          return (
            <DrawerItem
              key={d.id}
              icon={meta.icon}
              iconColor={meta.color}
              label={d.label}
              active={activeDisciplineId === d.id}
              onPress={() => go('Home', { disciplineId: d.id, disciplineLabel: d.label })}
            />
          );
        })}

        {isTeacher ? (
          <>
            <SectionLabel>Administração</SectionLabel>
            <DrawerItem icon="view-dashboard" label="Painel admin" onPress={() => go('AdminPosts')} />
            <DrawerItem icon="account-group" label="Professores" onPress={() => go('TeachersList')} />
            <DrawerItem icon="account-outline" label="Alunos" onPress={() => go('StudentsList')} />
          </>
        ) : null}

        <SectionLabel>Seções</SectionLabel>
        <DrawerItem icon="account-group-outline" label="Grupo" onPress={() => go('Grupo')} />
      </ScrollView>
    </SafeAreaView>
  );
}
