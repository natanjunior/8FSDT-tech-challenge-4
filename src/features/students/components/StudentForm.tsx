import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  studentSchema,
  studentSignupSchema,
  StudentFormData,
  StudentFormInput,
  StudentSignupData,
} from '@/features/students/validators/student.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PronounsPicker } from '@/components/ui/PronounsPicker';

type Mode = 'create' | 'edit' | 'signup';

/**
 * Field-values do RHF desacoplado do z.input do schema (ver TeacherForm).
 * `user` concreto opcional só para o form; output continua
 * StudentFormData | StudentSignupData.
 */
type StudentFormValues = Omit<StudentFormInput, 'user'> & {
  user?: { login?: string; password?: string };
};

interface StudentFormProps {
  mode: Mode;
  defaultValues?: Partial<StudentFormValues>;
  onSubmit: (data: StudentFormData | StudentSignupData) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export function StudentForm({
  mode,
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: StudentFormProps) {
  const [showPwd, setShowPwd] = useState(false);
  const schema = mode === 'signup' ? studentSignupSchema : studentSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues, unknown, StudentFormData | StudentSignupData>({
    resolver: zodResolver(schema) as Resolver<
      StudentFormValues,
      unknown,
      StudentFormData | StudentSignupData
    >,
    defaultValues: {
      name: '',
      email: '',
      birth_date: '',
      pronouns: undefined,
      biography: '',
      course: '',
      ...(mode === 'signup' ? { user: { login: '', password: '' } } : {}),
      ...defaultValues,
    },
  });

  const showCredentials = mode === 'create' || mode === 'signup';
  const credentialsTitle = mode === 'signup' ? 'Crie sua conta' : 'Credenciais (opcional)';
  const credentialsHint =
    mode === 'signup'
      ? 'Defina seu login e senha para acessar o app.'
      : 'Se preenchido, o aluno poderá fazer login. Se não, será criado sem acesso até receber um.';

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Ex: Pedro Costa"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="email@exemplo.com"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email?.message}
            hint="Opcional"
          />
        )}
      />

      <Controller
        control={control}
        name="birth_date"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Data de nascimento"
            placeholder="AAAA-MM-DD"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.birth_date?.message}
            hint="Opcional · formato AAAA-MM-DD"
          />
        )}
      />

      <View className="gap-2">
        <Text className="font-sans-bold text-sm text-primary">Pronomes</Text>
        <Controller
          control={control}
          name="pronouns"
          render={({ field: { onChange, value } }) => (
            <PronounsPicker value={value ?? null} onChange={(v) => onChange(v ?? undefined)} />
          )}
        />
      </View>

      <Controller
        control={control}
        name="course"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Curso"
            placeholder="Ex: Ensino Médio - 3º ano"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            hint="Opcional"
          />
        )}
      />

      <Controller
        control={control}
        name="biography"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Biografia"
            placeholder="Conte um pouco sobre o aluno..."
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            hint="Opcional"
          />
        )}
      />

      {showCredentials ? (
        <View className="gap-3 rounded-xl bg-surface-container-low p-4">
          <Text className="font-sans-bold text-sm text-primary">{credentialsTitle}</Text>
          <Text className="font-sans text-xs text-muted">{credentialsHint}</Text>
          <Controller
            control={control}
            name="user.login"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Login"
                placeholder="ex: pedro.costa"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                error={errors.user?.login?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="user.password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Senha"
                placeholder="mínimo 8 caracteres"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPwd}
                trailingIcon={showPwd ? 'eye-off-outline' : 'eye-outline'}
                onTrailingIconPress={() => setShowPwd((v) => !v)}
                error={errors.user?.password?.message}
              />
            )}
          />
        </View>
      ) : null}

      <Button
        title={submitLabel}
        onPress={handleSubmit((data) => onSubmit(data))}
        loading={isSubmitting}
      />
    </View>
  );
}
