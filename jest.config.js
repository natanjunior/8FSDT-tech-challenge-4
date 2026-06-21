module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@expo/vector-icons/(.*)$': '<rootDir>/__mocks__/@expo/vector-icons/$1',
    '^expo-linear-gradient$': '<rootDir>/__mocks__/expo-linear-gradient/index.tsx',
    '^expo-blur$': '<rootDir>/__mocks__/expo-blur/index.tsx',
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|expo-asset|expo-font|expo-modules-core|react-clone-referenced-element|@react-navigation|@react-native-async-storage|nativewind|react-native-css-interop|zod))',
  ],
};
