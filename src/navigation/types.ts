import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AdminStub: undefined;
  PostDetail: { postId: string; title?: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
