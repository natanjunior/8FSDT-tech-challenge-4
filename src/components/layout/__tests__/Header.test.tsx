import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderRight } from '@/components/layout/Header';
import * as AuthContextModule from '@/contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockNavigate = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

const guest = {
  user: null,
  profile: null,
  isAuthenticated: false,
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

const teacher = {
  user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

describe('HeaderRight', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Entrar" when guest', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText, queryByText } = render(<HeaderRight />);
    expect(getByText('Entrar')).toBeTruthy();
    expect(queryByText('Sair')).toBeNull();
    expect(queryByText('Painel')).toBeNull();
  });

  it('navigates to Login when "Entrar" is pressed', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText } = render(<HeaderRight />);
    fireEvent.press(getByText('Entrar'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('renders "Sair" but no "Painel" when STUDENT', () => {
    useAuthSpy.mockReturnValue(student);
    const { getByText, queryByText } = render(<HeaderRight />);
    expect(getByText('Sair')).toBeTruthy();
    expect(queryByText('Painel')).toBeNull();
    expect(queryByText('Entrar')).toBeNull();
  });

  it('renders both "Painel" and "Sair" when TEACHER', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByText } = render(<HeaderRight />);
    expect(getByText('Painel')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
  });

  it('navigates to AdminStub when TEACHER presses "Painel"', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByText } = render(<HeaderRight />);
    fireEvent.press(getByText('Painel'));
    expect(mockNavigate).toHaveBeenCalledWith('AdminStub');
  });

  it('calls logout when "Sair" is pressed', () => {
    const logoutMock = jest.fn();
    useAuthSpy.mockReturnValue({ ...teacher, logout: logoutMock });
    const { getByText } = render(<HeaderRight />);
    fireEvent.press(getByText('Sair'));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('renders "Grupo" for all auth states', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText, rerender } = render(<HeaderRight />);
    expect(getByText('Grupo')).toBeTruthy();

    useAuthSpy.mockReturnValue(student);
    rerender(<HeaderRight />);
    expect(getByText('Grupo')).toBeTruthy();

    useAuthSpy.mockReturnValue(teacher);
    rerender(<HeaderRight />);
    expect(getByText('Grupo')).toBeTruthy();
  });

  it('navigates to Grupo when "Grupo" is pressed', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText } = render(<HeaderRight />);
    fireEvent.press(getByText('Grupo'));
    expect(mockNavigate).toHaveBeenCalledWith('Grupo');
  });
});
