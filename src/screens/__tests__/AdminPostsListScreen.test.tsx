import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { AdminPostsListScreen } from '@/screens/AdminPostsListScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as postsService from '@/services/posts.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/posts.service');
jest.mock('@/services/disciplines.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockSearch = postsService.searchPosts as jest.Mock;
const mockDelete = postsService.deletePost as jest.Mock;
const mockListDisc = disciplinesService.listDisciplines as jest.Mock;

const teacher = {
  user: { id: 't1', login: 'joao', role: 'TEACHER' as const },
  profile: { id: 'Teacher/abc', name: 'João Silva' },
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const student = {
  user: { id: 's1', login: 'pedro', role: 'STUDENT' as const },
  profile: { id: 'Student/xyz', name: 'Pedro Costa' },
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const fakePost = (overrides: Partial<any> = {}) => ({
  id: 'p1',
  title: 'Post Teste',
  content: 'Conteúdo de teste com mais de dez caracteres.',
  status: 'DRAFT',
  published_at: null,
  created_at: '2026-05-10T10:00:00Z',
  updated_at: '2026-06-01T15:00:00Z',
  author: { id: 'Teacher/abc', name: 'João Silva', pronouns: 'ele/dele' },
  discipline: { id: 'd1', label: 'Matemática' },
  comments_count: 3,
  reads_count: 5,
  ...overrides,
});

const fakePage = (rows: any[]) => ({
  data: rows,
  pagination: { page: 1, limit: 10, total: rows.length, totalPages: 1 },
});

describe('AdminPostsListScreen — base', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ replace: mockReplace, navigate: mockNavigate });
    mockListDisc.mockResolvedValue([]);
    mockSearch.mockResolvedValue(fakePage([fakePost(), fakePost({ id: 'p2', title: 'Outro' })]));
  });

  it('redirects to Home when user is not TEACHER', async () => {
    useAuthSpy.mockReturnValue(student);
    render(<AdminPostsListScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('renders the list when user is TEACHER', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<AdminPostsListScreen />);
    expect(await findByText('Post Teste')).toBeTruthy();
    expect(await findByText('Outro')).toBeTruthy();
  });

  it('renders empty state when no posts', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockSearch.mockResolvedValueOnce(fakePage([]));
    const { findByText } = render(<AdminPostsListScreen />);
    expect(await findByText(/Nenhum post/i)).toBeTruthy();
  });

  it('opens ConfirmModal when delete icon pressed', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByTestId, getByText } = render(<AdminPostsListScreen />);
    const deleteBtn = await findByTestId('admin-post-p1-delete-btn');
    fireEvent.press(deleteBtn);
    expect(getByText(/Excluir post/i)).toBeTruthy();
  });

  it('calls deletePost only after confirm', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockDelete.mockResolvedValueOnce(undefined);
    const { findByTestId, getByText } = render(<AdminPostsListScreen />);
    const deleteBtn = await findByTestId('admin-post-p1-delete-btn');
    fireEvent.press(deleteBtn);

    expect(mockDelete).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(getByText('Excluir permanentemente'));
    });

    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('p1'));
  });

  it('navigates to PostEdit when pencil pressed', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByTestId } = render(<AdminPostsListScreen />);
    const editBtn = await findByTestId('admin-post-p1-edit-btn');
    fireEvent.press(editBtn);
    expect(mockNavigate).toHaveBeenCalledWith('PostEdit', { postId: 'p1' });
  });

  it('navigates to PostCreate when "Novo post" pressed', async () => {
    useAuthSpy.mockReturnValue(teacher);
    const { findByText } = render(<AdminPostsListScreen />);
    fireEvent.press(await findByText('Novo post'));
    expect(mockNavigate).toHaveBeenCalledWith('PostCreate');
  });
});
