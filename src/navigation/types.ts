import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AdminStub: undefined;
  PostDetail: { postId: string; title?: string };
  Grupo: undefined;
  PostCreate: undefined;
  PostEdit: { postId: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;
export type PostEditRouteProp = RouteProp<RootStackParamList, 'PostEdit'>;
