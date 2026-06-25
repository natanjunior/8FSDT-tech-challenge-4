import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { ProfileEditScreen } from '@/screens/ProfileEditScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as teachersService from '@/services/teachers.service';
import * as studentsService from '@/services/students.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/teachers.service');
jest.mock('@/services/students.service');
jest.mock('@/services/disciplines.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockGetMyTeacher = teachersService.getMyTeacher as jest.Mock;
const mockUpdateTeacher = teachersService.updateTeacher as jest.Mock;
const mockGetMyStudent = studentsService.getMyStudent as jest.Mock;
const mockUpdateStudent = studentsService.updateStudent as jest.Mock;
const mockListDisc = disciplinesService.listDisciplines as jest.Mock;
const mockRefresh = jest.fn();

const teacher = {
  id: 'Teacher/abc',
  name: 'João Silva',
  email: null,
  birth_date: null,
  pronouns: null,
  biography: null,
  status: 'ATIVO' as const,
  disciplines: [],
  user: { id: 'u1', login: 'joao', role: 'TEACHER' as const },
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

const teacherAuth = {
  user: teacher.user,
  profile: teacher,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: mockRefresh,
};

describe('ProfileEditScreen — TEACHER', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListDisc.mockResolvedValue([]);
    useAuthSpy.mockReturnValue(teacherAuth);
    mockGetMyTeacher.mockResolvedValueOnce(teacher);
  });

  it('renderiza form em modo edit com nome pré-populado', async () => {
    const { findByDisplayValue } = render(<ProfileEditScreen />);
    expect(await findByDisplayValue('João Silva')).toBeTruthy();
  });

  it('NÃO mostra bloco de credenciais (mode=edit)', async () => {
    const { findByDisplayValue, queryByText } = render(<ProfileEditScreen />);
    await findByDisplayValue('João Silva');
    expect(queryByText('Credenciais (opcional)')).toBeNull();
  });

  it('submete updateTeacher, chama refreshProfile e goBack', async () => {
    mockUpdateTeacher.mockResolvedValueOnce({ ...teacher, name: 'João Atualizado' });
    const { findByDisplayValue, getByText } = render(<ProfileEditScreen />);
    const field = await findByDisplayValue('João Silva');
    fireEvent.changeText(field, 'João Atualizado');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() =>
      expect(mockUpdateTeacher).toHaveBeenCalledWith(
        'Teacher/abc',
        expect.objectContaining({ name: 'João Atualizado' })
      )
    );
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});

describe('ProfileEditScreen — STUDENT', () => {
  const student = {
    id: 'Student/xyz',
    name: 'Pedro Costa',
    email: null,
    birth_date: null,
    pronouns: null,
    biography: null,
    status: 'ATIVO' as const,
    course: 'Ensino Médio',
    user: { id: 'u2', login: 'pedro', role: 'STUDENT' as const },
    created_at: '2026-02-01',
    updated_at: '2026-02-01',
  };

  const studentAuth = {
    user: student.user,
    profile: student,
    isAuthenticated: true,
    isHydrating: false,
    isAuthenticating: false,
    login: jest.fn(),
    logout: jest.fn(),
    refreshProfile: mockRefresh,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthSpy.mockReturnValue(studentAuth);
    mockGetMyStudent.mockResolvedValueOnce(student);
  });

  it('renderiza StudentForm em modo edit com nome e course', async () => {
    const { findByDisplayValue } = render(<ProfileEditScreen />);
    expect(await findByDisplayValue('Pedro Costa')).toBeTruthy();
    expect(await findByDisplayValue('Ensino Médio')).toBeTruthy();
  });

  it('submete updateStudent, chama refreshProfile e goBack', async () => {
    mockUpdateStudent.mockResolvedValueOnce(student);
    const { findByDisplayValue, getByText } = render(<ProfileEditScreen />);
    const field = await findByDisplayValue('Pedro Costa');
    fireEvent.changeText(field, 'Pedro Atualizado');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() =>
      expect(mockUpdateStudent).toHaveBeenCalledWith(
        'Student/xyz',
        expect.objectContaining({ name: 'Pedro Atualizado' })
      )
    );
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});
