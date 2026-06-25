import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { TeacherCreateScreen } from '@/screens/TeacherCreateScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as teachersService from '@/services/teachers.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/teachers.service');
jest.mock('@/services/disciplines.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate, goBack: mockGoBack }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockCreate = teachersService.createTeacher as jest.Mock;
const mockListDisc = disciplinesService.listDisciplines as jest.Mock;

const teacher = {
  user: { id: 't1', login: 'admin', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

const student = { ...teacher, user: { ...teacher.user, role: 'STUDENT' as const } };

describe('TeacherCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListDisc.mockResolvedValue([]);
  });

  it('redireciona STUDENT', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<TeacherCreateScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renderiza form vazio para TEACHER', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<TeacherCreateScreen />);
    expect(await findByText('Criar professor')).toBeTruthy();
  });

  it('navega para TeachersList após criar', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockCreate.mockResolvedValueOnce({
      id: 'Teacher/new',
      name: 'João Silva',
      status: 'ATIVO',
      disciplines: [],
    });
    const { getByText, getByPlaceholderText, findByPlaceholderText } = render(
      <TeacherCreateScreen />
    );
    await findByPlaceholderText('Ex: João Silva');
    fireEvent.changeText(getByPlaceholderText('Ex: João Silva'), 'João Silva');
    await act(async () => {
      fireEvent.press(getByText('Criar professor'));
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('TeachersList'));
  });
});
