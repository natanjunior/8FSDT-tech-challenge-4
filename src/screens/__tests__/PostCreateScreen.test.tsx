import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { PostCreateScreen } from '@/screens/PostCreateScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as postsService from '@/services/posts.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/posts.service');
jest.mock('@/services/disciplines.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, navigate: mockNavigate }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockCreate = postsService.createPost as jest.Mock;
const mockListDisc = disciplinesService.listDisciplines as jest.Mock;

// Use correct User shape: { id, login, role } + profile: null
const teacher = {
  user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const student = {
  user: { id: 's1', login: 'pedro.costa', role: 'STUDENT' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

describe('PostCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListDisc.mockResolvedValue([]);
  });

  it('redirects to Home when user is not TEACHER', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<PostCreateScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renders empty form when user is TEACHER', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<PostCreateScreen />);
    expect(await findByText('Criar post')).toBeTruthy();
  });

  it('navigates to PostDetail after successful create', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockCreate.mockResolvedValueOnce({
      id: 'new1',
      title: 'Novo título',
      content: 'Conteúdo com mais de dez caracteres.',
      status: 'DRAFT',
      published_at: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      author: { id: 't1', name: 'Prof', pronouns: null },
      discipline: null,
      comments_count: 0,
      reads_count: 0,
    });

    const { getByText, getByPlaceholderText, findByPlaceholderText } = render(
      <PostCreateScreen />
    );
    await findByPlaceholderText('Ex: Introdução à Álgebra Linear');

    fireEvent.changeText(
      getByPlaceholderText('Ex: Introdução à Álgebra Linear'),
      'Novo título'
    );
    fireEvent.changeText(
      getByPlaceholderText('Escreva o conteúdo do post...'),
      'Conteúdo com mais de dez caracteres.'
    );

    await act(async () => {
      fireEvent.press(getByText('Criar post'));
    });

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('PostDetail', {
        postId: 'new1',
        title: 'Novo título',
      })
    );
  });
});
