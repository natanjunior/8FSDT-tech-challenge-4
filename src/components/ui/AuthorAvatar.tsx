import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarVariant = 'initials' | 'icon';

interface AuthorAvatarProps {
  name?: string | null;
  size?: AvatarSize;
  variant?: AvatarVariant;
  testID?: string;
}

const SIZE_PX: Record<AvatarSize, number> = { sm: 36, md: 40, lg: 48 };
const FONT_PX: Record<AvatarSize, number> = { sm: 12, md: 13, lg: 16 };
const ICON_PX: Record<AvatarSize, number> = { sm: 18, md: 20, lg: 24 };

const PALETTE = [
  colors.avatarBlue,
  colors.avatarEmerald,
  colors.avatarTeal,
  colors.avatarAmber,
  colors.avatarRose,
  colors.avatarViolet,
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join('');
}

function getPalette(name: string | null | undefined) {
  if (!name) return colors.avatarSlate;
  return PALETTE[hashCode(name) % PALETTE.length]!;
}

export function AuthorAvatar({
  name,
  size = 'md',
  variant = 'initials',
  testID,
}: AuthorAvatarProps) {
  const safe = name && name.trim().length > 0 ? name : null;
  const palette = getPalette(safe);
  const px = SIZE_PX[size];

  return (
    <View
      testID={testID}
      style={{
        width: px,
        height: px,
        borderRadius: px / 2,
        backgroundColor: palette.bg,
        borderWidth: 2,
        borderColor: palette.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {variant === 'icon' ? (
        <View testID={testID ? `${testID}-icon` : undefined}>
          <Icon name="account" size={ICON_PX[size]} color={palette.text} />
        </View>
      ) : (
        <Text
          className="font-sans-black"
          style={{ color: palette.text, fontSize: FONT_PX[size] }}
        >
          {safe ? getInitials(safe) : '?'}
        </Text>
      )}
    </View>
  );
}
