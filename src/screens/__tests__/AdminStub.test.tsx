import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AdminStub } from '@/screens/AdminStub';
import * as AuthContextModule from '@/contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const mockReplace = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ replace: mockReplace, navigate: jest.fn() });

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

const teacher = {
  user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const student = {
  user: { id: 's1', login: 'pedro.costa', role: 'STUDENT' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const guest = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

describe('AdminStub', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders placeholder content for TEACHER', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByText } = render(<AdminStub />);
    expect(getByText('Painel admin — em construção')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('redirects to Home and shows toast for STUDENT', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<AdminStub />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('Home');
    });
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'info',
        text1: 'Acesso restrito',
      })
    );
  });

  it('redirects to Home and shows toast for guest', async () => {
    useAuthSpy.mockReturnValue(guest);
    render(<AdminStub />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('Home');
    });
    expect(Toast.show).toHaveBeenCalled();
  });

  it('navigates to PostCreate when "+ Novo post" is pressed (TEACHER)', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      replace: mockReplace,
      navigate: mockNavigate,
    });
    useAuthSpy.mockReturnValue(teacher);
    const { getByText } = render(<AdminStub />);
    fireEvent.press(getByText('+ Novo post'));
    expect(mockNavigate).toHaveBeenCalledWith('PostCreate');
  });
});
