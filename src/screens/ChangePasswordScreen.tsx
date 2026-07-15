import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  changePasswordSchema,
  ChangePasswordFormData,
  ChangePasswordFormInput,
} from '@/features/profile/validators/change-password.schema';
import { changePassword } from '@/services/auth.service';
import type { RootStackNavigationProp } from '@/navigation/types';

export function ChangePasswordScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigation.replace('Home');
  }, [isAuthenticated, navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormInput, unknown, ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirm: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSubmitError(null);
    try {
      await changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      Toast.show({ type: 'success', text1: 'Senha alterada.' });
      navigation.goBack();
    } catch (err: any) {
      setSubmitError(err?.message ?? 'Não foi possível alterar a senha.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-5 p-6">
          <View className="gap-1">
            <Text className="font-sans-black text-2xl text-primary">
              Trocar senha
            </Text>
            <Text className="font-sans text-sm text-muted">
              Informe sua senha atual e escolha uma nova.
            </Text>
          </View>

          <Controller
            control={control}
            name="current_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha atual"
                placeholder="Senha atual"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
                trailingIcon={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                onTrailingIconPress={() => setShowCurrent((v) => !v)}
                trailingIconLabel={showCurrent ? 'Ocultar senha' : 'Mostrar senha'}
                error={errors.current_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="new_password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nova senha"
                placeholder="Nova senha (mín. 8 chars)"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showNew}
                autoCapitalize="none"
                trailingIcon={showNew ? 'eye-off-outline' : 'eye-outline'}
                onTrailingIconPress={() => setShowNew((v) => !v)}
                trailingIconLabel={showNew ? 'Ocultar senha' : 'Mostrar senha'}
                error={errors.new_password?.message}
                hint="Mínimo 8 caracteres; deve ser diferente da atual"
              />
            )}
          />

          <Controller
            control={control}
            name="new_password_confirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirmar nova senha"
                placeholder="Confirme a nova senha"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                trailingIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                onTrailingIconPress={() => setShowConfirm((v) => !v)}
                trailingIconLabel={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                error={errors.new_password_confirm?.message}
              />
            )}
          />

          {submitError ? (
            <Text testID="submit-error" className="font-sans-medium text-sm text-error">
              {submitError}
            </Text>
          ) : null}

          <Button
            testID="change-password-submit"
            title="Trocar senha"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            leadingIcon="lock-outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
