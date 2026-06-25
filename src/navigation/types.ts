import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Login: { login?: string } | undefined;
  Signup: undefined;
  AdminPosts: undefined;
  PostDetail: { postId: string; title?: string };
  Grupo: undefined;
  PostCreate: undefined;
  PostEdit: { postId: string };
  TeacherCreate: undefined;
  TeacherEdit: { id: string };
  TeachersList: undefined;
  StudentsList: undefined;
  StudentCreate: undefined;
  StudentEdit: { id: string };
  Profile: undefined;
  ProfileEdit: undefined;
  ChangePassword: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;
export type PostEditRouteProp = RouteProp<RootStackParamList, 'PostEdit'>;
export type TeacherEditRouteProp = RouteProp<RootStackParamList, 'TeacherEdit'>;
export type StudentEditRouteProp = RouteProp<RootStackParamList, 'StudentEdit'>;
