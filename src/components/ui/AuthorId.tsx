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
  testID?: string;
}

export function AuthorId({
  name,
  subtitle,
  date,
  size = 'md',
  avatarVariant = 'initials',
  testID,
}: AuthorIdProps) {
  const displayName = name && name.trim().length > 0 ? name : 'Autor removido';
  const gap = size === 'lg' ? 'gap-4' : 'gap-3';
  const nameClass = size === 'lg' ? 'font-sans-bold text-base text-primary' : 'font-sans-bold text-sm text-primary';
  const subtitleClass = size === 'sm' ? 'font-sans text-[10px] text-outline' : 'font-sans text-xs text-muted';

  return (
    <View testID={testID} className={`flex-row items-center ${gap}`}>
      <View testID={testID ? `${testID}-avatar` : undefined}>
        <AuthorAvatar name={name} size={size} variant={avatarVariant} />
      </View>
      <View>
        <Text className={nameClass}>{displayName}</Text>
        {subtitle ? <Text className={subtitleClass}>{subtitle}</Text> : null}
        {size === 'lg' && date ? (
          <Text className="font-jetbrains text-xs text-outline mt-0.5">{date}</Text>
        ) : null}
      </View>
    </View>
  );
}
