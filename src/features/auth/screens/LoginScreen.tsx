import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
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
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Blog FIAP</Text>
            <Text className="text-base text-muted">
              Login passwordless por e-mail.
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  placeholder="seu@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
