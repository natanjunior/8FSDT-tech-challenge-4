import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AdminStub: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
