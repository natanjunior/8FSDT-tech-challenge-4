import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  AdminPosts: undefined;
  PostDetail: { postId: string; title?: string };
  Grupo: undefined;
  PostCreate: undefined;
  PostEdit: { postId: string };
  TeacherCreate: undefined;
  TeacherEdit: { id: string };
  StudentsList: undefined;
  StudentCreate: undefined;
  StudentEdit: { id: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;
export type PostEditRouteProp = RouteProp<RootStackParamList, 'PostEdit'>;
export type TeacherEditRouteProp = RouteProp<RootStackParamList, 'TeacherEdit'>;
