import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { StudentEditScreen } from '@/screens/StudentEditScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as studentsService from '@/services/students.service';

jest.mock('@/services/students.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
  useRoute: () => ({ params: { id: 'Student/xyz' } }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockGetById = studentsService.getStudentById as jest.Mock;
const mockUpdate = studentsService.updateStudent as jest.Mock;

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

const existing = {
  id: 'Student/xyz',
  name: 'Pedro Costa',
  email: 'p@x.com',
  birth_date: null,
  pronouns: 'ele/dele' as const,
  biography: null,
  status: 'ATIVO' as const,
  course: 'Análise e Desenvolvimento de Sistemas',
  user: null,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

describe('StudentEditScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carrega e pré-popula', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce(existing);
    const { findByDisplayValue } = render(<StudentEditScreen />);
    expect(await findByDisplayValue('Pedro Costa')).toBeTruthy();
  });

  it('submete PATCH e dá goBack', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce(existing);
    mockUpdate.mockResolvedValueOnce({ ...existing, name: 'Pedro Novo' });
    const { findByDisplayValue, getByText } = render(<StudentEditScreen />);
    const field = await findByDisplayValue('Pedro Costa');
    fireEvent.changeText(field, 'Pedro Novo');
    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(
        'Student/xyz',
        expect.objectContaining({ name: 'Pedro Novo' })
      )
    );
    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});
