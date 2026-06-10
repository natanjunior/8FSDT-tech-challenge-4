import React from 'react';
import { Text } from 'react-native';

// Lightweight mock for Jest — avoids async font-loading setState noise
const MaterialCommunityIcons = ({
  name,
  testID,
}: {
  name: string;
  size?: number;
  color?: string;
  testID?: string;
}) => <Text testID={testID}>{name}</Text>;

export default MaterialCommunityIcons;
