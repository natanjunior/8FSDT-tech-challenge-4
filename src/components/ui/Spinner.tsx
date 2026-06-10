import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '@/theme/colors';

interface SpinnerProps {
  size?: 'sm' | 'md';
  testID?: string;
}

const SIZE_PX: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 12,
  md: 20,
};

const BORDER_PX: Record<NonNullable<SpinnerProps['size']>, number> = {
  sm: 1.5,
  md: 2,
};

export function Spinner({ size = 'md', testID }: SpinnerProps) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando"
      style={{ width: SIZE_PX[size], height: SIZE_PX[size] }}
    >
      <Animated.View
        style={{
          width: SIZE_PX[size],
          height: SIZE_PX[size],
          borderRadius: SIZE_PX[size] / 2,
          borderWidth: BORDER_PX[size],
          borderColor: colors.secondary,
          borderTopColor: 'transparent',
          transform: [{ rotate }],
        }}
      />
    </View>
  );
}
