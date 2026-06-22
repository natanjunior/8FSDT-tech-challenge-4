import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { StudentCreateScreen } from '@/screens/StudentCreateScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as studentsService from '@/services/students.service';

jest.mock('@/services/students.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate, goBack: mockGoBack }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockCreate = studentsService.createStudent as jest.Mock;

const teacher = {
  user: { id: 't1', login: 'admin', role: 'TEACHER' as const },
  profile: { id: 'Teacher/admin', name: 'Admin' },
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const student = { ...teacher, user: { ...teacher.user, role: 'STUDENT' as const } };

describe('StudentCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redireciona STUDENT', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<StudentCreateScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renderiza form vazio para TEACHER', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<StudentCreateScreen />);
    expect(await findByText('Criar aluno')).toBeTruthy();
  });

  it('navega para StudentsList após criar', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockCreate.mockResolvedValueOnce({
      id: 'Student/new',
      name: 'Pedro Costa',
      status: 'ATIVO',
    });
    const { getByText, getByPlaceholderText, findByPlaceholderText } = render(
      <StudentCreateScreen />
    );
    await findByPlaceholderText('Ex: Pedro Costa');
    fireEvent.changeText(getByPlaceholderText('Ex: Pedro Costa'), 'Pedro Costa');
    await act(async () => {
      fireEvent.press(getByText('Criar aluno'));
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('StudentsList'));
  });
});
