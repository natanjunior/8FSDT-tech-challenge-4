import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';
import { primaryShadow } from '@/theme/elevation';

export type ButtonVariant =
  | 'primary'        // cta-gradient teal — CTAs de formulário (Criar post, Salvar, Entrar no login)
  | 'nav'            // primary-gradient navy — botão "Entrar" do header visitante
  | 'secondary'      // ghost outline — Cancelar, ações secundárias
  | 'danger'         // sólido vermelho — Confirmar exclusão (no modal)
  | 'danger-outline';// outline vermelho — botão "Excluir post" na sidebar de edição

type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
}

const SIZE_CONTAINER: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-3.5',
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

const SIZE_ICON: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

// Padding do gradiente aplicado via `style` (NativeWind não passa className
// para o <LinearGradient>, então padding/centralização precisam ser inline).
const GRADIENT_PADDING: Record<ButtonSize, { paddingHorizontal: number; paddingVertical: number }> = {
  sm: { paddingHorizontal: 16, paddingVertical: 8 },
  md: { paddingHorizontal: 24, paddingVertical: 12 },
  lg: { paddingHorizontal: 32, paddingVertical: 14 },
};

// typed as readonly tuples so LinearGradient's `colors` prop is satisfied
const GRADIENT_COLORS: Partial<Record<ButtonVariant, readonly [string, string]>> = {
  primary: ['#006A61', '#005049'], // cta-gradient teal (90deg)
  nav: ['#022448', '#1E3A5F'],     // primary-gradient navy (135deg)
};

const TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: 'text-white font-sans-bold',
  nav: 'text-white font-sans-bold',
  secondary: 'text-foreground font-sans-bold',
  danger: 'text-white font-sans-bold',
  'danger-outline': 'text-error font-sans-bold',
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  testID,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const gradient = GRADIENT_COLORS[variant];
  const iconColor =
    variant === 'secondary' ? colors.foreground :
    variant === 'danger-outline' ? colors.error :
    colors.primaryForeground;

  const sizeClass = SIZE_CONTAINER[size];

  // Estilo do container externo
  const containerClass = (() => {
    if (variant === 'secondary') {
      return `flex-row items-center justify-center gap-2 rounded-xl ${sizeClass} bg-surface-container-lowest border border-outline-variant`;
    }
    if (variant === 'danger') {
      return `flex-row items-center justify-center gap-2 rounded-xl ${sizeClass} bg-error`;
    }
    if (variant === 'danger-outline') {
      return `flex-row items-center justify-center gap-2 rounded-xl ${sizeClass} bg-surface-container-lowest border border-error`;
    }
    // primary / nav (gradient — borda já vem do gradient)
    return `flex-row items-center justify-center gap-2 rounded-xl ${sizeClass} overflow-hidden`;
  })();

  const containerStyle = variant === 'primary' || variant === 'nav' ? primaryShadow : undefined;

  const innerContent = (
    <>
      {leadingIcon ? (
        <View testID={testID ? `${testID}-leading-icon` : undefined}>
          <Icon name={leadingIcon} size={SIZE_ICON[size]} color={iconColor} />
        </View>
      ) : null}
      <Text className={`${SIZE_TEXT[size]} ${TEXT_CLASS[variant]}`}>
        {title}
      </Text>
      {trailingIcon ? (
        <View testID={testID ? `${testID}-trailing-icon` : undefined}>
          <Icon name={trailingIcon} size={SIZE_ICON[size]} color={iconColor} />
        </View>
      ) : null}
    </>
  );

  if (gradient) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isDisabled}
        testID={testID}
        className={`rounded-xl ${isDisabled ? 'opacity-50' : ''}`}
        style={containerStyle}
        {...rest}
      >
        <LinearGradient
          colors={gradient}
          start={variant === 'nav' ? { x: 0, y: 0 } : { x: 0, y: 0.5 }}
          end={variant === 'nav' ? { x: 1, y: 1 } : { x: 1, y: 0.5 }}
          testID={testID ? `${testID}-gradient` : undefined}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 8,
            ...GRADIENT_PADDING[size],
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            innerContent
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      testID={testID}
      className={`${containerClass} ${isDisabled ? 'opacity-50' : ''}`}
      style={containerStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        innerContent
      )}
    </TouchableOpacity>
  );
}
