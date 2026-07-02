import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AppDrawerContent } from '@/navigation/AppDrawerContent';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/disciplines.service');
const mockListDisciplines = disciplinesService.listDisciplines as jest.Mock;
const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

const baseAuth = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};
const student = { ...baseAuth, user: { id: 's1', login: 'aluno', role: 'STUDENT' as const }, isAuthenticated: true };
const teacher = { ...baseAuth, user: { id: 't1', login: 'prof', role: 'TEACHER' as const }, isAuthenticated: true };

const makeProps = () => ({
  navigation: { navigate: jest.fn(), closeDrawer: jest.fn() } as any,
  state: { index: 0, routes: [{ key: 'Root-1', name: 'Root' }] } as any,
  descriptors: {} as any,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockListDisciplines.mockResolvedValue([
    { id: 'd1', label: 'Matemática' },
    { id: 'd2', label: 'Ciências' },
  ]);
});

describe('AppDrawerContent', () => {
  it('lista as disciplinas vindas do serviço', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const { findByText } = render(<AppDrawerContent {...makeProps()} />);
    expect(await findByText('Matemática')).toBeTruthy();
    expect(await findByText('Ciências')).toBeTruthy();
  });

  it('mostra a seção Administração para TEACHER', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<AppDrawerContent {...makeProps()} />);
    expect(await findByText('Painel admin')).toBeTruthy();
    expect(await findByText('Professores')).toBeTruthy();
    expect(await findByText('Alunos')).toBeTruthy();
  });

  it('oculta Administração para STUDENT', async () => {
    useAuthSpy.mockReturnValue(student);
    const { findByText, queryByText } = render(<AppDrawerContent {...makeProps()} />);
    await findByText('Matemática'); // espera montar
    expect(queryByText('Painel admin')).toBeNull();
    expect(queryByText('Professores')).toBeNull();
    expect(queryByText('Alunos')).toBeNull();
  });

  it('oculta Administração para anônimo', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const { findByText, queryByText } = render(<AppDrawerContent {...makeProps()} />);
    await findByText('Matemática');
    expect(queryByText('Painel admin')).toBeNull();
  });

  it('não tem item de login no drawer', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const { findByText, queryByText } = render(<AppDrawerContent {...makeProps()} />);
    await findByText('Matemática');
    expect(queryByText('Entrar')).toBeNull();
    expect(queryByText('Login')).toBeNull();
  });

  it('navega para AdminPosts (aninhado em Root) ao tocar Painel admin', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const props = makeProps();
    const { findByText } = render(<AppDrawerContent {...props} />);
    fireEvent.press(await findByText('Painel admin'));
    expect(props.navigation.navigate).toHaveBeenCalledWith('Root', {
      screen: 'AdminPosts',
      params: undefined,
    });
  });

  it('navega para Home com o disciplineId ao tocar numa disciplina', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const props = makeProps();
    const { findByText } = render(<AppDrawerContent {...props} />);
    fireEvent.press(await findByText('Matemática'));
    expect(props.navigation.navigate).toHaveBeenCalledWith('Root', {
      screen: 'Home',
      params: { disciplineId: 'd1', disciplineLabel: 'Matemática' },
    });
  });
});
