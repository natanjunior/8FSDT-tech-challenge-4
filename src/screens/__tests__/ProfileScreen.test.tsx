import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from '@/screens/ProfileScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as teachersService from '@/services/teachers.service';
import * as studentsService from '@/services/students.service';

jest.mock('@/services/teachers.service');
jest.mock('@/services/students.service');

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, replace: mockReplace }),
  useFocusEffect: (cb: () => void) => cb(),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockGetMyTeacher = teachersService.getMyTeacher as jest.Mock;
const mockGetMyStudent = studentsService.getMyStudent as jest.Mock;

const fakeTeacher = {
  id: 'Teacher/abc',
  name: 'João Silva',
  email: 'joao@x.com',
  birth_date: '1990-05-15',
  pronouns: 'ele/dele' as const,
  biography: 'Adoro álgebra.',
  status: 'ATIVO' as const,
  disciplines: [{ id: 'd1', label: 'Matemática' }],
  user: { id: 'u1', login: 'joao.silva', role: 'TEACHER' as const },
  created_at: '2026-01-01',
  updated_at: '2026-06-01',
};

const fakeStudent = {
  id: 'Student/xyz',
  name: 'Pedro Costa',
  email: null,
  birth_date: null,
  pronouns: null,
  biography: null,
  status: 'ATIVO' as const,
  course: 'Ensino Médio - 3º ano',
  user: { id: 'u2', login: 'pedro', role: 'STUDENT' as const },
  created_at: '2026-02-01',
  updated_at: '2026-02-01',
};

const teacherAuth = {
  user: fakeTeacher.user,
  profile: fakeTeacher,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

const studentAuth = {
  user: fakeStudent.user,
  profile: fakeStudent,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

const guest = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

describe('ProfileScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redireciona anônimo para Home', async () => {
    useAuthSpy.mockReturnValue(guest);
    render(<ProfileScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('TEACHER: chama getMyTeacher e renderiza disciplinas', async () => {
    useAuthSpy.mockReturnValue(teacherAuth);
    mockGetMyTeacher.mockResolvedValueOnce(fakeTeacher);
    const { findByText } = render(<ProfileScreen />);
    expect(await findByText('João Silva')).toBeTruthy();
    expect(await findByText('Matemática')).toBeTruthy();
    expect(await findByText('joao.silva')).toBeTruthy();
  });

  it('STUDENT: chama getMyStudent e renderiza course', async () => {
    useAuthSpy.mockReturnValue(studentAuth);
    mockGetMyStudent.mockResolvedValueOnce(fakeStudent);
    const { findByText } = render(<ProfileScreen />);
    expect(await findByText('Pedro Costa')).toBeTruthy();
    expect(await findByText('Ensino Médio - 3º ano')).toBeTruthy();
  });

  it('STUDENT sem course: renderiza "Sem curso"', async () => {
    useAuthSpy.mockReturnValue(studentAuth);
    mockGetMyStudent.mockResolvedValueOnce({ ...fakeStudent, course: null });
    const { findByText } = render(<ProfileScreen />);
    expect(await findByText('Sem curso')).toBeTruthy();
  });

  it('navega para ProfileEdit ao tocar "Editar perfil"', async () => {
    useAuthSpy.mockReturnValue(teacherAuth);
    mockGetMyTeacher.mockResolvedValueOnce(fakeTeacher);
    const { findByText } = render(<ProfileScreen />);
    fireEvent.press(await findByText('Editar perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('ProfileEdit');
  });

  it('navega para ChangePassword ao tocar "Trocar senha"', async () => {
    useAuthSpy.mockReturnValue(teacherAuth);
    mockGetMyTeacher.mockResolvedValueOnce(fakeTeacher);
    const { findByText } = render(<ProfileScreen />);
    fireEvent.press(await findByText('Trocar senha'));
    expect(mockNavigate).toHaveBeenCalledWith('ChangePassword');
  });
});
