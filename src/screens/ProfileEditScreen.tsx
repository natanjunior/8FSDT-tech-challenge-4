import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherForm } from '@/features/teachers/components/TeacherForm';
import { StudentForm } from '@/features/students/components/StudentForm';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getMyTeacher, updateTeacher } from '@/services/teachers.service';
import { getMyStudent, updateStudent } from '@/services/students.service';
import type { TeacherFormData } from '@/features/teachers/validators/teacher.schema';
import type { StudentFormData } from '@/features/students/validators/student.schema';
import type { Student, Teacher } from '@/types/api';
import type { RootStackNavigationProp } from '@/navigation/types';

export function ProfileEditScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, isAuthenticated, logout, refreshProfile } = useAuth();
  const isTeacher = user?.role === 'TEACHER';

  const [data, setData] = useState<Teacher | Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth redirect — separate effect so navigation reference changes
  // don't re-trigger the data-fetch effect below.
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  // Data fetch — depends only on auth/role, not on navigation reference.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const fetched = isTeacher ? await getMyTeacher() : await getMyStudent();
        if (!cancelled) setData(fetched);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isTeacher]);

  if (!isAuthenticated) return null;
  if (isLoading) return <Loader fullScreen message="Carregando perfil..." />;
  if (notFound || !data) {
    return (
      <EmptyState
        title="Perfil não encontrado"
        action={{ label: 'Voltar', onPress: () => navigation.goBack() }}
      />
    );
  }

  const handleSubmit = async (payload: TeacherFormData | StudentFormData) => {
    setIsSubmitting(true);
    try {
      if (isTeacher) {
        await updateTeacher(data.id, payload as TeacherFormData);
      } else {
        await updateStudent(data.id, payload as StudentFormData);
      }
      await refreshProfile();
      Toast.show({ type: 'success', text1: 'Perfil atualizado.' });
      navigation.goBack();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        await logout();
        navigation.replace('Login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao salvar',
          text2: err?.response?.data?.error ?? 'Tente novamente.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        {isTeacher ? (
          <TeacherForm
            mode="edit"
            submitLabel="Salvar alterações"
            isSubmitting={isSubmitting}
            onSubmit={(payload) => handleSubmit(payload)}
            defaultValues={{
              name: data.name,
              email: data.email ?? '',
              birth_date: data.birth_date ?? '',
              pronouns: data.pronouns ?? undefined,
              biography: data.biography ?? '',
              discipline_ids: (data as Teacher).disciplines.map((d) => d.id),
            }}
          />
        ) : (
          <StudentForm
            mode="edit"
            submitLabel="Salvar alterações"
            isSubmitting={isSubmitting}
            onSubmit={(payload) => handleSubmit(payload as StudentFormData)}
            defaultValues={{
              name: data.name,
              email: data.email ?? '',
              birth_date: data.birth_date ?? '',
              pronouns: data.pronouns ?? undefined,
              biography: data.biography ?? '',
              course: (data as Student).course ?? '',
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
