import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HeaderRight } from '@/components/layout/Header';
import * as AuthContextModule from '@/contexts/AuthContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockNavigate = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');

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
const student = { ...guest, user: { id: 's1', login: 'pedro.costa', role: 'STUDENT' as const }, isAuthenticated: true };
const teacher = { ...guest, user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const }, isAuthenticated: true };

// HeaderRight passa a chamar useSafeAreaInsets → precisa de SafeAreaProvider.
// initialMetrics explícito é obrigatório: o mock do jest-expo expõe initialWindowMetrics=null,
// e sem métricas o provider não renderiza os filhos síncronamente. (jest roda como iOS.)
const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};
function Wrapped() {
  return (
    <SafeAreaProvider initialMetrics={METRICS}>
      <HeaderRight />
    </SafeAreaProvider>
  );
}
const renderHeader = () => render(<Wrapped />);

// Abre o menu com um inset de topo específico e devolve o `top` resolvido do card.
function menuCardTop(insetTop: number): number {
  const { getByTestId } = render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: insetTop, left: 0, right: 0, bottom: 0 },
      }}
    >
      <HeaderRight />
    </SafeAreaProvider>
  );
  fireEvent.press(getByTestId('header-user-trigger'));
  const flat = StyleSheet.flatten(getByTestId('header-account-menu').props.style) as { top: number };
  return flat.top;
}

describe('HeaderRight', () => {
  afterEach(() => jest.clearAllMocks());

  it('visitante: mostra "Entrar" e nada de "Grupo"/"Sair"/"Painel"', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText, queryByText } = renderHeader();
    expect(getByText('Entrar')).toBeTruthy();
    expect(queryByText('Grupo')).toBeNull();
    expect(queryByText('Sair')).toBeNull();
    expect(queryByText('Painel')).toBeNull();
  });

  it('navega para Login ao tocar "Entrar"', () => {
    useAuthSpy.mockReturnValue(guest);
    const { getByText } = renderHeader();
    fireEvent.press(getByText('Entrar'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('não renderiza mais o botão "Grupo" em nenhum estado', () => {
    useAuthSpy.mockReturnValue(guest);
    const { queryByText, rerender } = renderHeader();
    expect(queryByText('Grupo')).toBeNull();
    useAuthSpy.mockReturnValue(student);
    rerender(<Wrapped />);
    expect(queryByText('Grupo')).toBeNull();
    useAuthSpy.mockReturnValue(teacher);
    rerender(<Wrapped />);
    expect(queryByText('Grupo')).toBeNull();
  });

  it('dropdown (TEACHER) = só conta: Meu perfil, Trocar senha, Sair; sem admin', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByText, queryByText } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    expect(getByText('Meu perfil')).toBeTruthy();
    expect(getByText('Trocar senha')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
    expect(queryByText('Painel')).toBeNull();
    expect(queryByText('Professores')).toBeNull();
    expect(queryByText('Alunos')).toBeNull();
  });

  it('dropdown (STUDENT) = Meu perfil, Trocar senha, Sair; sem admin', () => {
    useAuthSpy.mockReturnValue(student);
    const { getByTestId, getByText, queryByText } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    expect(getByText('Meu perfil')).toBeTruthy();
    expect(getByText('Trocar senha')).toBeTruthy();
    expect(getByText('Sair')).toBeTruthy();
    expect(queryByText('Painel')).toBeNull();
  });

  it('navega para Profile ao tocar "Meu perfil"', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByText } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByText('Meu perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });

  it('navega para ChangePassword ao tocar "Trocar senha"', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByText } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByText('Trocar senha'));
    expect(mockNavigate).toHaveBeenCalledWith('ChangePassword');
  });

  it('chama logout ao tocar "Sair"', () => {
    const logoutMock = jest.fn();
    useAuthSpy.mockReturnValue({ ...teacher, logout: logoutMock });
    const { getByTestId, getByText } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByText('Sair'));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('dropdown: os 3 itens expõem accessibilityRole "button" com label acessível', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByRole } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    expect(getByRole('button', { name: 'Meu perfil' })).toBeTruthy();
    expect(getByRole('button', { name: 'Trocar senha' })).toBeTruthy();
    expect(getByRole('button', { name: 'Sair' })).toBeTruthy();
  });

  it('dropdown: pressionar pelo role "button" dispara a ação (Meu perfil → Profile)', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId, getByRole } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    fireEvent.press(getByRole('button', { name: 'Meu perfil' }));
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });

  it('dropdown: card do menu marca accessibilityViewIsModal', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByTestId } = renderHeader();
    fireEvent.press(getByTestId('header-user-trigger'));
    expect(getByTestId('header-account-menu').props.accessibilityViewIsModal).toBe(true);
  });

  // F-H2: posição do card deriva do safe-area inset (substitui o antigo `top: 49` fixo).
  it('dropdown: posição do card deriva do safe-area inset, não de valor fixo (F-H2)', () => {
    useAuthSpy.mockReturnValue(teacher);
    // com inset 0, o top é exatamente HEADER_BAR_HEIGHT → garante que o termo constante
    // (offset da barra) é somado; o teste diferencial sozinho cancelaria esse termo.
    const bar = Platform.select({ ios: 44, default: 56 }) as number; // jest roda como iOS → 44
    const topAt0 = menuCardTop(0);
    expect(topAt0).toBe(bar);
    // e varia 1:1 com insets.top (47 vs 0)
    expect(menuCardTop(47) - topAt0).toBe(47);
  });
});
