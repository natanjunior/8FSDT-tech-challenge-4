import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { TeachersListScreen } from '@/screens/TeachersListScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as teachersService from '@/services/teachers.service';

jest.mock('@/services/teachers.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockList = teachersService.listTeachers as jest.Mock;
const mockDelete = teachersService.deleteTeacher as jest.Mock;
const mockReactivate = teachersService.reactivateTeacher as jest.Mock;

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

const fakeTeacher = (overrides: Partial<any> = {}) => ({
  id: 'Teacher/abc',
  name: 'João Silva',
  email: null,
  birth_date: null,
  pronouns: null,
  biography: null,
  status: 'ATIVO',
  disciplines: [{ id: 'd1', label: 'Matemática' }],
  user: null,
  created_at: '2026-01-01',
  updated_at: '2026-06-01',
  ...overrides,
});

const fakePage = (rows: any[]) => ({
  data: rows,
  pagination: { page: 1, limit: 20, total: rows.length, totalPages: 1 },
});

describe('TeachersListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockList.mockResolvedValue(fakePage([fakeTeacher()]));
  });

  it('redireciona quando não é TEACHER', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<TeachersListScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renderiza lista com nome do teacher', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<TeachersListScreen />);
    expect(await findByText('João Silva')).toBeTruthy();
  });

  it('mostra "1 disciplina" / "N disciplinas"', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<TeachersListScreen />);
    expect(await findByText(/1 disciplina/i)).toBeTruthy();
  });

  it('abre ConfirmModal ao tocar trash; só desativa após confirmar', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockDelete.mockResolvedValueOnce(undefined);
    const { findByTestId, getByText } = render(<TeachersListScreen />);
    const trash = await findByTestId('teacher-Teacher/abc-delete-btn');
    fireEvent.press(trash);
    expect(getByText(/Desativar professor/i)).toBeTruthy();
    expect(mockDelete).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.press(getByText('Desativar'));
    });
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('Teacher/abc'));
  });

  it('navega para TeacherEdit ao tocar pencil', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByTestId } = render(<TeachersListScreen />);
    fireEvent.press(await findByTestId('teacher-Teacher/abc-edit-btn'));
    expect(mockNavigate).toHaveBeenCalledWith('TeacherEdit', { id: 'Teacher/abc' });
  });

  it('navega para TeacherCreate ao tocar "Novo professor"', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<TeachersListScreen />);
    fireEvent.press(await findByText('Novo professor'));
    expect(mockNavigate).toHaveBeenCalledWith('TeacherCreate');
  });

  it('mostra botão "Reativar" em item INATIVO e chama reactivateTeacher', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockList.mockResolvedValueOnce(fakePage([fakeTeacher({ status: 'INATIVO' })]));
    mockReactivate.mockResolvedValueOnce(fakeTeacher({ status: 'ATIVO' }));
    const { findByText } = render(<TeachersListScreen />);
    const reactivar = await findByText('Reativar');
    await act(async () => {
      fireEvent.press(reactivar);
    });
    await waitFor(() => expect(mockReactivate).toHaveBeenCalledWith('Teacher/abc'));
  });
});
