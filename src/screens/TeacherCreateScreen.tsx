import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireRole } from '@/hooks/useRequireRole';
import { TeacherForm } from '@/features/teachers/components/TeacherForm';
import { createTeacher } from '@/services/teachers.service';
import type { TeacherFormData } from '@/features/teachers/validators/teacher.schema';
import type { RootStackNavigationProp } from '@/navigation/types';

export function TeacherCreateScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!allowed) return null;

  const handleSubmit = async (data: TeacherFormData) => {
    setIsSubmitting(true);
    try {
      await createTeacher(data);
      Toast.show({ type: 'success', text1: 'Professor criado.' });
      navigation.navigate('TeachersList');
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
          text2: 'Escolha outro login para o professor.',
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
        <TeacherForm
          mode="create"
          onSubmit={handleSubmit}
          submitLabel="Criar professor"
          isSubmitting={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}
