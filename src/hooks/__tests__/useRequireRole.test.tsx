import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import { useRequireRole } from '@/hooks/useRequireRole';
import * as AuthContextModule from '@/contexts/AuthContext';

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace }),
}));
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

const teacher: ReturnType<typeof AuthContextModule.useAuth> = {
  user: { id: 't1', login: 'joao.silva', role: 'TEACHER' },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const student: ReturnType<typeof AuthContextModule.useAuth> = {
  user: { id: 's1', login: 'ana.souza', role: 'STUDENT' },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const guest: ReturnType<typeof AuthContextModule.useAuth> = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

function Probe({ role }: { role: 'TEACHER' | 'STUDENT' }) {
  const allowed = useRequireRole(role);
  return <Text testID="status">{allowed ? 'allowed' : 'blocked'}</Text>;
}

describe('useRequireRole', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true and does nothing when user has the required role', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId } = render(<Probe role="TEACHER" />);
    expect(getByTestId('status').props.children).toBe('allowed');
    expect(mockReplace).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('returns false and redirects when role mismatch', async () => {
    useAuthSpy.mockReturnValue(student);
    const { getByTestId } = render(<Probe role="TEACHER" />);
    expect(getByTestId('status').props.children).toBe('blocked');
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info', text1: 'Acesso restrito' }),
    );
  });

  it('returns false and redirects when guest tries protected route', async () => {
    useAuthSpy.mockReturnValue(guest);
    render(<Probe role="TEACHER" />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info', text1: 'Acesso restrito' }),
    );
  });
});
