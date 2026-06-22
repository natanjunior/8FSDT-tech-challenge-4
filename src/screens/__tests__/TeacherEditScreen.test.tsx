import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { TeacherEditScreen } from '@/screens/TeacherEditScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as teachersService from '@/services/teachers.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/teachers.service');
jest.mock('@/services/disciplines.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
  useRoute: () => ({ params: { id: 'Teacher/abc' } }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockGetById = teachersService.getTeacherById as jest.Mock;
const mockUpdate = teachersService.updateTeacher as jest.Mock;
const mockListDisc = disciplinesService.listDisciplines as jest.Mock;

const teacher = {
  user: { id: 't1', login: 'admin', role: 'TEACHER' as const },
  profile: { id: 'Teacher/admin', name: 'Admin' },
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const existing = {
  id: 'Teacher/abc',
  name: 'João Antigo',
  email: 'j@x.com',
  birth_date: null,
  pronouns: 'ele/dele' as const,
  biography: null,
  status: 'ATIVO' as const,
  disciplines: [],
  user: null,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

describe('TeacherEditScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListDisc.mockResolvedValue([]);
  });

  it('carrega e pré-popula', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce(existing);
    const { findByDisplayValue } = render(<TeacherEditScreen />);
    expect(await findByDisplayValue('João Antigo')).toBeTruthy();
  });

  it('submete PATCH e dá goBack', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce(existing);
    mockUpdate.mockResolvedValueOnce({ ...existing, name: 'João Novo' });
    const { findByDisplayValue, getByText } = render(<TeacherEditScreen />);
    const field = await findByDisplayValue('João Antigo');
    fireEvent.changeText(field, 'João Novo');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(
        'Teacher/abc',
        expect.objectContaining({ name: 'João Novo' })
      )
    );
    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});
