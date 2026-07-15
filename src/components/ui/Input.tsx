import React, { forwardRef } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  onTrailingIconPress?: () => void;
  /** Nome acessível do botão de ícone final (ex.: "Mostrar senha", "Limpar busca"). */
  trailingIconLabel?: string;
  testID?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leadingIcon,
    trailingIcon,
    onTrailingIconPress,
    trailingIconLabel,
    testID,
    ...rest
  },
  ref
) {
  const hasError = Boolean(error);
  const showHint = !hasError && Boolean(hint);

  return (
    <View className="gap-1">
      {label ? (
        <Text className="text-sm font-sans-bold text-primary">{label}</Text>
      ) : null}

      <View
        className={`flex-row items-center rounded-xl px-4 ${
          hasError
            ? 'bg-error-container/20 border border-error/40'
            : 'bg-surface-container-low border border-transparent focus:border-secondary'
        }`}
      >
        {leadingIcon ? (
          <View
            testID={testID ? `${testID}-leading-icon` : undefined}
            className="mr-2"
          >
            <Icon name={leadingIcon} size={18} color={colors.muted} />
          </View>
        ) : null}

        <TextInput
          ref={ref}
          placeholderTextColor={colors.muted}
          testID={testID}
          className="flex-1 py-3 font-sans text-base text-foreground"
          accessibilityLabel={label}
          {...rest}
        />

        {trailingIcon ? (
          <TouchableOpacity
            testID={testID ? `${testID}-trailing-icon` : undefined}
            onPress={onTrailingIconPress}
            disabled={!onTrailingIconPress}
            className="ml-2 p-1"
            accessibilityRole="button"
            accessibilityLabel={trailingIconLabel}
            accessibilityState={{ disabled: !onTrailingIconPress }}
          >
            <Icon name={trailingIcon} size={18} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {hasError ? (
        <Text
          testID="input-error"
          className="text-error text-sm font-sans-medium"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
      {showHint ? (
        <Text className="font-sans text-xs text-muted">{hint}</Text>
      ) : null}
    </View>
  );
});
