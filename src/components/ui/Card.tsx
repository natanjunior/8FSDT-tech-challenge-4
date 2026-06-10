import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { editorialShadow, softShadow } from '@/theme/elevation';

type CardElevation = 'none' | 'soft' | 'editorial';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevation?: CardElevation;
}

const ELEVATION_STYLE: Record<CardElevation, ViewStyle | undefined> = {
  none: undefined,
  soft: softShadow as ViewStyle,
  editorial: editorialShadow as ViewStyle,
};

export function Card({
  children,
  className = '',
  elevation = 'editorial',
}: CardProps) {
  return (
    <View
      className={`rounded-xl bg-surface-container-lowest p-6 ${className}`}
      style={ELEVATION_STYLE[elevation]}
    >
      {children}
    </View>
  );
}
