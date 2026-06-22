import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import { StudentForm } from '@/features/students/components/StudentForm';
import { signupStudent } from '@/services/students.service';
import type { StudentSignupData } from '@/features/students/validators/student.schema';
import type { RootStackNavigationProp } from '@/navigation/types';

export function SignupScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'STUDENT') {
      Toast.show({
        type: 'info',
        text1: 'Você já está cadastrado',
      });
      navigation.replace('Home');
    }
  }, [isAuthenticated, user, navigation]);

  const handleSubmit = async (data: StudentSignupData) => {
    setIsSubmitting(true);
    try {
      const created = await signupStudent(data);
      Toast.show({
        type: 'success',
        text1: 'Cadastro concluído!',
        text2: 'Faça login para acessar.',
      });
      navigation.navigate('Login', { login: created.user?.login ?? data.user.login });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        Toast.show({
          type: 'error',
          text1: 'Login já em uso',
          text2: 'Escolha outro login.',
        });
      } else if (status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Cadastro indisponível',
          text2: 'Tente novamente após sair da sua conta.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao cadastrar',
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
        <Text className="font-sans-black text-2xl text-primary">
          Cadastre-se como aluno
        </Text>
        <Text className="font-sans text-sm text-muted">
          Preencha seus dados para criar uma conta de aluno.
        </Text>
        <StudentForm
          mode="signup"
          onSubmit={(data) => handleSubmit(data as StudentSignupData)}
          submitLabel="Cadastrar"
          isSubmitting={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}
