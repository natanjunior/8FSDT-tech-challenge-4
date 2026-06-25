import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { PostEditScreen } from '@/screens/PostEditScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as postsService from '@/services/posts.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/posts.service');
jest.mock('@/services/disciplines.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace, goBack: mockGoBack }),
  useRoute: () => ({ params: { postId: 'p1' } }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockGetById = postsService.getPostById as jest.Mock;
const mockUpdate = postsService.updatePost as jest.Mock;
const mockListDisc = disciplinesService.listDisciplines as jest.Mock;

const teacher = {
  user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

const student = {
  user: { id: 's1', login: 'pedro.costa', role: 'STUDENT' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
};

const existingPost = {
  id: 'p1',
  title: 'Título antigo',
  content: 'Conteúdo antigo com mais de dez caracteres.',
  status: 'PUBLISHED',
  published_at: '2026-01-01',
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  author: { id: 'Teacher/t1', name: 'Prof', pronouns: null },
  discipline: null,
  comments_count: 0,
  reads_count: 0,
};

describe('PostEditScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListDisc.mockResolvedValue([]);
  });

  it('redirects when user is not TEACHER', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<PostEditScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('loads post and pre-populates the form', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce(existingPost);

    const { findByDisplayValue } = render(<PostEditScreen />);
    expect(await findByDisplayValue('Título antigo')).toBeTruthy();
  });

  it('submits PATCH and goes back on success', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce(existingPost);
    mockUpdate.mockResolvedValueOnce({ ...existingPost, title: 'Título novo' });

    const { findByDisplayValue, getByText } = render(<PostEditScreen />);
    const titleField = await findByDisplayValue('Título antigo');

    fireEvent.changeText(titleField, 'Título novo');

    await act(async () => {
      fireEvent.press(getByText('Salvar alterações'));
    });

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(
        'p1',
        expect.objectContaining({ title: 'Título novo' })
      )
    );
    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});
