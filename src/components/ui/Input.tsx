import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, ...rest },
  ref
) {
  return (
    <View className="gap-1">
      {label ? (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor="#94A3B8"
        className={`rounded-lg border bg-card px-3 py-3 text-base text-foreground ${error ? 'border-error' : 'border-border'}`}
        {...rest}
      />
      {error ? (
        <Text testID="input-error" className="text-sm text-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
});
