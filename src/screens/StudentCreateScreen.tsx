import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireRole } from '@/hooks/useRequireRole';
import { StudentForm } from '@/features/students/components/StudentForm';
import { createStudent } from '@/services/students.service';
import type { StudentFormData } from '@/features/students/validators/student.schema';
import type { RootStackNavigationProp } from '@/navigation/types';

export function StudentCreateScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!allowed) return null;

  const handleSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      await createStudent(data);
      Toast.show({ type: 'success', text1: 'Aluno criado.' });
      navigation.navigate('StudentsList');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        Toast.show({ type: 'error', text1: 'Sessão expirada' });
        await logout();
        navigation.replace('Login');
      } else if (status === 409) {
        Toast.show({
          type: 'error',
          text1: 'Login já em uso',
          text2: 'Escolha outro login para o aluno.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar',
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
          mode="create"
          onSubmit={handleSubmit}
          submitLabel="Criar aluno"
          isSubmitting={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}
