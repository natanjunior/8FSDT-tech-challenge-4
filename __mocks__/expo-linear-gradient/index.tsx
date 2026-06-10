import React from 'react';
import { View } from 'react-native';

// Lightweight mock for Jest — the native gradient is not available in the test environment.
// We render a plain View so that testID and children pass through correctly.
export const LinearGradient = ({
  children,
  testID,
  style,
  ...rest
}: {
  children?: React.ReactNode;
  testID?: string;
  style?: object;
  [key: string]: unknown;
}) => <View testID={testID} style={style}>{children}</View>;
