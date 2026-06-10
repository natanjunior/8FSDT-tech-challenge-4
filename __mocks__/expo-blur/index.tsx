import React from 'react';
import { View } from 'react-native';

// Lightweight mock for Jest — the native blur is not available in the test environment.
// We render a plain View so that style and children pass through correctly.
export const BlurView = ({
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
