import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  teacherSchema,
  TeacherFormData,
  TeacherFormInput,
} from '@/features/teachers/validators/teacher.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PronounsPicker } from '@/components/ui/PronounsPicker';
import { DisciplinesMultiSelect } from '@/components/ui/DisciplinesMultiSelect';
import { listDisciplines } from '@/services/disciplines.service';
import type { Discipline } from '@/types/api';

type Mode = 'create' | 'edit';

/**
 * Field-values do RHF desacoplado do z.input do schema: o campo `user`
 * usa z.preprocess (cujo z.input é `unknown`), o que quebraria o FieldPath.
 * Aqui declaramos `user` como objeto concreto opcional só para o form.
 * O output (3º generic do useForm) continua sendo TeacherFormData.
 */
type TeacherFormValues = Omit<TeacherFormInput, 'user'> & {
  user?: { login?: string; password?: string };
};

interface TeacherFormProps {
  mode: Mode;
  defaultValues?: Partial<TeacherFormValues>;
  onSubmit: (data: TeacherFormData) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export function TeacherForm({
  mode,
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: TeacherFormProps) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    listDisciplines().then(setDisciplines);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormValues, unknown, TeacherFormData>({
    resolver: zodResolver(teacherSchema) as Resolver<TeacherFormValues, unknown, TeacherFormData>,
    defaultValues: {
      name: '',
      email: '',
      birth_date: '',
      pronouns: undefined,
      biography: '',
      discipline_ids: [],
      ...defaultValues,
    },
  });

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Ex: João Silva"
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
        name="biography"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Biografia"
            placeholder="Conte um pouco sobre o professor..."
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            hint="Opcional"
          />
        )}
      />

      <View className="gap-2">
        <Text className="font-sans-bold text-sm text-primary">Disciplinas</Text>
        <Controller
          control={control}
          name="discipline_ids"
          render={({ field: { onChange, value } }) => (
            <DisciplinesMultiSelect
              disciplines={disciplines}
              selectedIds={value ?? []}
              onChange={onChange}
            />
          )}
        />
      </View>

      {mode === 'create' ? (
        <View className="gap-3 rounded-xl bg-surface-container-low p-4">
          <Text className="font-sans-bold text-sm text-primary">
            Credenciais (opcional)
          </Text>
          <Text className="font-sans text-xs text-muted">
            Se preenchido, o professor poderá fazer login. Se não, será criado sem acesso até receber um.
          </Text>
          <Controller
            control={control}
            name="user.login"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Login"
                placeholder="ex: joao.silva"
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
                trailingIconLabel={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
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
