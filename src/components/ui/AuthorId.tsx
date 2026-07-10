import React from 'react';
import { Text, View } from 'react-native';
import { AuthorAvatar } from '@/components/ui/AuthorAvatar';

type Size = 'sm' | 'md' | 'lg';

interface AuthorIdProps {
  name?: string | null;
  subtitle?: string;
  date?: string;
  size?: Size;
  avatarVariant?: 'initials' | 'icon';
  /** 'onDark' inverte as cores do texto para uso sobre fundos escuros (header/drawer navy). */
  tone?: 'default' | 'onDark';
  testID?: string;
}

export function AuthorId({
  name,
  subtitle,
  date,
  size = 'md',
  avatarVariant = 'initials',
  tone = 'default',
  testID,
}: AuthorIdProps) {
  const displayName = name && name.trim().length > 0 ? name : 'Autor removido';
  const onDark = tone === 'onDark';
  const gap = size === 'lg' ? 'gap-4' : 'gap-3';
  const nameColor = onDark ? 'text-primary-foreground' : 'text-primary';
  const subtitleColor = onDark
    ? 'text-on-primary-container'
    : size === 'sm'
      ? 'text-outline'
      : 'text-muted';
  const dateColor = onDark ? 'text-on-primary-container' : 'text-outline';
  const nameClass = `${size === 'lg' ? 'font-sans-bold text-base' : 'font-sans-bold text-sm'} ${nameColor}`;
  const subtitleClass = `${size === 'sm' ? 'font-sans text-[10px]' : 'font-sans text-xs'} ${subtitleColor}`;

  return (
    <View testID={testID} className={`flex-row items-center ${gap}`}>
      <View testID={testID ? `${testID}-avatar` : undefined}>
        <AuthorAvatar name={name} size={size} variant={avatarVariant} />
      </View>
      <View>
        <Text className={nameClass}>{displayName}</Text>
        {subtitle ? <Text className={subtitleClass}>{subtitle}</Text> : null}
        {size === 'lg' && date ? (
          <Text className={`font-jetbrains text-xs ${dateColor} mt-0.5`}>{date}</Text>
        ) : null}
      </View>
    </View>
  );
}
