import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireRole } from '@/hooks/useRequireRole';
import { StudentForm } from '@/features/students/components/StudentForm';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getStudentById, updateStudent } from '@/services/students.service';
import type { StudentFormData } from '@/features/students/validators/student.schema';
import type {
  RootStackNavigationProp,
  StudentEditRouteProp,
} from '@/navigation/types';
import type { Student } from '@/types/api';

export function StudentEditScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<StudentEditRouteProp>();
  const { logout } = useAuth();
  const { id } = route.params;

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      try {
        const fetched = await getStudentById(id);
        if (!cancelled) setStudent(fetched);
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
  if (isLoading) return <Loader fullScreen message="Carregando aluno..." />;
  if (notFound || !student) {
    return (
      <EmptyState
        title="Aluno não encontrado"
        action={{ label: 'Voltar', onPress: () => navigation.goBack() }}
      />
    );
  }

  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await updateStudent(id, data);
      Toast.show({ type: 'success', text1: 'Aluno atualizado.' });
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
        <StudentForm
          mode="edit"
          submitLabel="Salvar alterações"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          defaultValues={{
            name: student.name,
            email: student.email ?? '',
            birth_date: student.birth_date ?? '',
            pronouns: student.pronouns ?? undefined,
            biography: student.biography ?? '',
            course: student.course ?? '',
          }}
        />
      </View>
    </ScrollView>
  );
}
