import React from 'react';
import { View } from 'react-native';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <View className={`rounded-md bg-secondary ${className}`} />;
}
