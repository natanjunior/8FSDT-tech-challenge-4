import React from 'react';

// In tests, NativeWind's createInteropElement just delegates to React.createElement
// (className styling is dropped — tests verify behavior, not styles).
export const createInteropElement = React.createElement;
export const createElement = React.createElement;
export const cssInterop = (component: any) => component;
export const remapProps = (component: any) => component;
export const StyleSheet = { create: (styles: any) => styles };
export const colorScheme = { get: () => 'light', set: () => {} };
export const useColorScheme = () => ({ colorScheme: 'light', setColorScheme: () => {} });

export default {};
