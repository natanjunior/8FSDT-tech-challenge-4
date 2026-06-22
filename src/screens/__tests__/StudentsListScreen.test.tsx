import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { StudentsListScreen } from '@/screens/StudentsListScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as studentsService from '@/services/students.service';

jest.mock('@/services/students.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockList = studentsService.listStudents as jest.Mock;
const mockDelete = studentsService.deleteStudent as jest.Mock;

const teacher = {
  user: { id: 't1', login: 'admin', role: 'TEACHER' as const },
  profile: { id: 'Teacher/admin', name: 'Admin' },
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const fakeStudent = (overrides: Partial<any> = {}) => ({
  id: 'Student/xyz',
  name: 'Pedro Costa',
  email: null,
  birth_date: null,
  pronouns: null,
  biography: null,
  status: 'ATIVO',
  course: 'Ensino Médio - 3º ano',
  user: null,
  created_at: '2026-01-01',
  updated_at: '2026-06-01',
  ...overrides,
});

const fakePage = (rows: any[]) => ({
  data: rows,
  pagination: { page: 1, limit: 20, total: rows.length, totalPages: 1 },
});

describe('StudentsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockList.mockResolvedValue(fakePage([fakeStudent()]));
  });

  it('redireciona quando não é TEACHER', async () => {
    useAuthSpy.mockReturnValue({ ...teacher, user: { ...teacher.user, role: 'STUDENT' as const } });
    render(<StudentsListScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renderiza lista com nome e course', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<StudentsListScreen />);
    expect(await findByText('Pedro Costa')).toBeTruthy();
    expect(await findByText('Ensino Médio - 3º ano')).toBeTruthy();
  });

  it('mostra "Sem curso" quando course é null', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockList.mockResolvedValueOnce(fakePage([fakeStudent({ course: null })]));
    const { findByText } = render(<StudentsListScreen />);
    expect(await findByText('Sem curso')).toBeTruthy();
  });

  it('abre ConfirmModal ao tocar trash e desativa após confirmar', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockDelete.mockResolvedValueOnce(undefined);
    const { findByTestId, getByText } = render(<StudentsListScreen />);
    const trash = await findByTestId('student-Student/xyz-delete-btn');
    fireEvent.press(trash);
    expect(getByText(/Desativar aluno/i)).toBeTruthy();
    await act(async () => {
      fireEvent.press(getByText('Desativar'));
    });
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('Student/xyz'));
  });
});
