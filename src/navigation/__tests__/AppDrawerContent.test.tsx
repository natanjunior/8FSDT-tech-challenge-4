import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
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

// Estado do Drawer com uma tela do Native Stack aninhado em foco.
const makeState = (focusedName: string, params?: object) =>
  ({
    index: 0,
    routes: [
      {
        key: 'Root-1',
        name: 'Root',
        state: {
          index: 0,
          routes: [{ key: `${focusedName}-1`, name: focusedName, params }],
        },
      },
    ],
  }) as any;

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

  // D1 — "Home" deve LIMPAR o filtro de disciplina. Params explícitos
  // (não `undefined`) garantem a limpeza sob merge=false e merge=true.
  it('limpa o filtro de disciplina ao tocar em Home (params explícitos)', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const props = makeProps();
    const { findByText } = render(<AppDrawerContent {...props} />);
    fireEvent.press(await findByText('Home'));
    expect(props.navigation.navigate).toHaveBeenCalledWith('Root', {
      screen: 'Home',
      params: { disciplineId: undefined, disciplineLabel: undefined },
    });
  });

  // D3 — realce do item ativo, tipado e válido também fora da Home.
  it('destaca a Home quando é a tela focada sem filtro', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const props = makeProps();
    props.state = makeState('Home');
    const { findByText, getByRole } = render(<AppDrawerContent {...props} />);
    await findByText('Home');
    expect(getByRole('button', { name: 'Home' })).toHaveAccessibilityState({
      selected: true,
    });
  });

  it('destaca a disciplina ativa (e não a Home) quando há filtro', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const props = makeProps();
    props.state = makeState('Home', { disciplineId: 'd1', disciplineLabel: 'Matemática' });
    const { findByText, getByRole } = render(<AppDrawerContent {...props} />);
    await findByText('Matemática');
    expect(getByRole('button', { name: 'Matemática' })).toHaveAccessibilityState({
      selected: true,
    });
    expect(getByRole('button', { name: 'Home' })).toHaveAccessibilityState({
      selected: false,
    });
  });

  it('destaca a tela focada mesmo fora da Home (Painel admin)', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const props = makeProps();
    props.state = makeState('AdminPosts');
    const { findByText, getByRole } = render(<AppDrawerContent {...props} />);
    await findByText('Painel admin');
    expect(getByRole('button', { name: 'Painel admin' })).toHaveAccessibilityState({
      selected: true,
    });
    expect(getByRole('button', { name: 'Home' })).toHaveAccessibilityState({
      selected: false,
    });
  });

  // D5 — falha ao carregar disciplinas não pode ser engolida em silêncio.
  it('loga um aviso quando listDisciplines falha (sem swallow silencioso)', async () => {
    useAuthSpy.mockReturnValue(baseAuth);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockListDisciplines.mockRejectedValueOnce(new Error('boom'));
    render(<AppDrawerContent {...makeProps()} />);
    await waitFor(() => expect(warnSpy).toHaveBeenCalled());
    warnSpy.mockRestore();
  });
});
