import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useRequireRole } from '@/hooks/useRequireRole';
import { TeacherForm } from '@/features/teachers/components/TeacherForm';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getTeacherById, updateTeacher } from '@/services/teachers.service';
import type { TeacherFormData } from '@/features/teachers/validators/teacher.schema';
import type {
  RootStackNavigationProp,
  TeacherEditRouteProp,
} from '@/navigation/types';
import type { Teacher } from '@/types/api';

export function TeacherEditScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<TeacherEditRouteProp>();
  const { id } = route.params;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      try {
        const fetched = await getTeacherById(id);
        if (!cancelled) setTeacher(fetched);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [allowed, id]);

  if (!allowed) return null;
  if (isLoading) return <Loader fullScreen message="Carregando professor..." />;
  if (notFound || !teacher) {
    return (
      <EmptyState
        title="Professor não encontrado"
        action={{ label: 'Voltar', onPress: () => navigation.goBack() }}
      />
    );
  }

  const handleSubmit = async (data: TeacherFormData) => {
    setIsSubmitting(true);
    try {
      await updateTeacher(id, data);
      Toast.show({ type: 'success', text1: 'Professor atualizado.' });
      navigation.goBack();
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: err?.response?.data?.error ?? 'Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <TeacherForm
          mode="edit"
          submitLabel="Salvar alterações"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          defaultValues={{
            name: teacher.name,
            email: teacher.email ?? '',
            birth_date: teacher.birth_date ?? '',
            pronouns: teacher.pronouns ?? undefined,
            biography: teacher.biography ?? '',
            discipline_ids: teacher.disciplines.map((d) => d.id),
          }}
        />
      </View>
    </ScrollView>
  );
}
