import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { LoginRouteProp } from '@/navigation/types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginSchema,
  LoginFormData,
} from '@/features/auth/validators/login.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackNavigationProp } from '@/navigation/types';

export function LoginScreen() {
  const { login, isAuthenticating } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<LoginRouteProp>();
  const prefilledLogin = route.params?.login ?? '';
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: prefilledLogin, password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    try {
      await login(data);
      navigation.replace('Home');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Não foi possível entrar.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center gap-6 p-6">
          <View className="gap-2 items-center">
            <Text className="text-3xl font-bold text-foreground text-center">
              TC4
            </Text>
            <Text className="text-base text-muted text-center">
              Entre com seu login e senha.
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="login"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Login"
                  placeholder="ex: joao.silva"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.login?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={passwordRef}
                  label="Senha"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />

            {submitError ? (
              <Text className="text-sm text-error" testID="submit-error">
                {submitError}
              </Text>
            ) : null}

            <Button
              title="Entrar"
              onPress={handleSubmit(onSubmit)}
              loading={isAuthenticating}
            />

            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => navigation.navigate('Signup')}
              className="items-center pt-2"
            >
              <Text className="font-sans-medium text-sm text-secondary">
                Não tem conta? Cadastre-se como aluno
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
