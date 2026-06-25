import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { AuthorId } from '@/components/ui/AuthorId';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DisciplineBadge } from '@/components/ui/DisciplineBadge';
import { Icon } from '@/components/ui/Icon';
import { Loader } from '@/components/ui/Loader';
import { getMyTeacher } from '@/services/teachers.service';
import { getMyStudent } from '@/services/students.service';
import { colors } from '@/theme/colors';
import type { Student, Teacher } from '@/types/api';
import type { RootStackNavigationProp } from '@/navigation/types';

function formatDateLong(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

export function ProfileScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, isAuthenticated } = useAuth();
  const isTeacher = user?.role === 'TEACHER';
  const [data, setData] = useState<Teacher | Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const fetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  const fetchProfile = useCallback(() => {
    if (!isAuthenticated || !user) return;
    if (fetchingRef.current) return;
    // In production, re-fetch on focus to pick up edits made in ProfileEdit.
    // In tests (useFocusEffect mock fires on every render), guard against
    // repeated calls once data has been set.
    if (hasFetchedRef.current) return;
    fetchingRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const fetched = isTeacher ? await getMyTeacher() : await getMyStudent();
        if (!cancelled) {
          setData(fetched);
          setIsLoading(false);
          hasFetchedRef.current = true;
        }
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setIsLoading(false);
        }
      } finally {
        fetchingRef.current = false;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isTeacher, user?.id]);

  useFocusEffect(fetchProfile);

  if (!isAuthenticated) return null;
  if (isLoading) return <Loader fullScreen message="Carregando perfil..." />;
  if (notFound || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="font-sans text-base text-muted">
          Não foi possível carregar o perfil.
        </Text>
      </View>
    );
  }

  const isActive = data.status === 'ATIVO';

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-4 p-4">
        {/* Hero */}
        <Card>
          <AuthorId
            name={data.name}
            subtitle={data.pronouns ?? (isTeacher ? 'Professor' : 'Aluno')}
            date={formatDateLong(data.created_at)}
            size="lg"
          />
        </Card>

        {/* Informações pessoais */}
        <Card>
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Icon name="account-circle-outline" size={18} color={colors.primary} />
              <Text className="font-sans-bold text-sm uppercase tracking-wider text-primary">
                Informações pessoais
              </Text>
            </View>
            <View className="gap-2">
              <View>
                <Text className="font-sans-medium text-xs uppercase tracking-wider text-muted">
                  Email
                </Text>
                <Text className="font-sans text-base text-foreground">
                  {data.email ?? '—'}
                </Text>
              </View>
              <View>
                <Text className="font-sans-medium text-xs uppercase tracking-wider text-muted">
                  Data de nascimento
                </Text>
                <Text className="font-sans text-base text-foreground">
                  {data.birth_date ? formatDateLong(data.birth_date) : '—'}
                </Text>
              </View>
              <View>
                <Text className="font-sans-medium text-xs uppercase tracking-wider text-muted">
                  Biografia
                </Text>
                <Text className="font-sans text-base text-foreground leading-6">
                  {data.biography ?? '—'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Acadêmico */}
        <Card>
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Icon name="school-outline" size={18} color={colors.primary} />
              <Text className="font-sans-bold text-sm uppercase tracking-wider text-primary">
                Acadêmico
              </Text>
            </View>
            {isTeacher ? (
              (data as Teacher).disciplines.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {(data as Teacher).disciplines.map((d) => (
                    <DisciplineBadge key={d.id} label={d.label} />
                  ))}
                </View>
              ) : (
                <Text className="font-sans text-sm text-muted">
                  Nenhuma disciplina vinculada.
                </Text>
              )
            ) : (
              <Text className="font-sans text-base text-foreground">
                {(data as Student).course ?? 'Sem curso'}
              </Text>
            )}
          </View>
        </Card>

        {/* Conta */}
        <Card>
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Icon name="cog-outline" size={18} color={colors.primary} />
              <Text className="font-sans-bold text-sm uppercase tracking-wider text-primary">
                Conta
              </Text>
            </View>
            <View className="gap-2">
              <View>
                <Text className="font-sans-medium text-xs uppercase tracking-wider text-muted">
                  Login
                </Text>
                <Text className="font-jetbrains text-base text-foreground">
                  {data.user?.login ?? '—'}
                </Text>
              </View>
              <View>
                <Text className="font-sans-medium text-xs uppercase tracking-wider text-muted">
                  Status
                </Text>
                <View
                  className={`mt-1 self-start flex-row items-center gap-1.5 rounded-full px-2.5 py-0.5 ${
                    isActive ? 'bg-status-published/10' : 'bg-status-archived/10'
                  }`}
                >
                  <View
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? 'bg-status-published' : 'bg-status-archived'
                    }`}
                  />
                  <Text
                    className={`font-sans-bold text-[10px] ${
                      isActive ? 'text-status-published' : 'text-status-archived'
                    }`}
                  >
                    {data.status}
                  </Text>
                </View>
              </View>
              <View>
                <Text className="font-sans-medium text-xs uppercase tracking-wider text-muted">
                  Conta criada em
                </Text>
                <Text className="font-jetbrains text-sm text-muted">
                  {formatDateShort(data.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Ações */}
        <View className="gap-2 pt-2">
          <Button
            title="Editar perfil"
            leadingIcon="pencil-outline"
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          <Button
            title="Trocar senha"
            variant="secondary"
            leadingIcon="lock-outline"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
