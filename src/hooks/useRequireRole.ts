import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';
import type { RootStackNavigationProp } from '@/navigation/types';
import type { UserRole } from '@/types/api';

export function useRequireRole(requiredRole: UserRole): boolean {
  const { user } = useAuth();
  const navigation = useNavigation<RootStackNavigationProp>();
  const allowed = user?.role === requiredRole;

  useEffect(() => {
    if (!allowed) {
      Toast.show({
        type: 'info',
        text1: 'Acesso restrito',
        text2:
          requiredRole === 'TEACHER'
            ? 'Esta área é exclusiva para professores.'
            : 'Acesso negado.',
      });
      navigation.replace('Home');
    }
  }, [allowed, requiredRole, navigation]);

  return allowed;
}
