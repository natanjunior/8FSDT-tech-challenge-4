import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';
import { editorialShadow } from '@/theme/elevation';

type Variant = 'destructive' | 'neutral';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: Variant;
  icon?: IconName;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  testID?: string;
}

const VARIANT_ICON: Record<Variant, IconName> = {
  destructive: 'trash-can-outline',
  neutral: 'alert-circle-outline',
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'destructive',
  icon,
  onConfirm,
  onCancel,
  isLoading = false,
  testID,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const iconBg = variant === 'destructive' ? 'bg-error-container' : 'bg-surface-container';
  const iconColor = variant === 'destructive' ? colors.error : colors.outline;
  const resolvedIcon = icon ?? VARIANT_ICON[variant];
  const confirmVariant = variant === 'destructive' ? 'danger' : 'primary';

  return (
    <Modal
      transparent
      // animationType="none": na arquitetura nova do RN, desmontar/dispensar um
      // Modal nativo enquanto uma animação de fade está em curso pode deixar uma
      // camada transparente presa engolindo toques (mesma classe do popover).
      // Sem animação, a dispensa é instantânea e limpa.
      animationType="none"
      visible={isOpen}
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCancel}
        className="flex-1 items-center justify-center bg-foreground/40 px-4"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          testID={testID}
          className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 gap-5"
          style={editorialShadow}
        >
          <View className="flex-row items-start gap-3">
            <View
              testID={testID ? `${testID}-icon` : undefined}
              className={`h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
            >
              <Icon name={resolvedIcon} size={24} color={iconColor} />
            </View>
            <View className="flex-1">
              <Text className="font-sans-black text-base text-primary leading-tight">
                {title}
              </Text>
              <Text className="font-sans text-sm text-muted leading-5 mt-1">
                {description}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-end gap-2 pt-1">
            <Button
              title={cancelLabel}
              variant="secondary"
              size="sm"
              onPress={onCancel}
            />
            <Button
              title={confirmLabel}
              variant={confirmVariant}
              size="sm"
              loading={isLoading}
              onPress={onConfirm}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
