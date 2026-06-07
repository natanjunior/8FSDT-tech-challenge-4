import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PostDetailScreen } from '@/screens/PostDetailScreen';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as postsService from '@/services/posts.service';
import * as readsService from '@/services/reads.service';

jest.mock('@/services/posts.service', () => ({
  getPostById: jest.fn(),
}));
jest.mock('@/services/reads.service', () => ({
  hasReadPost: jest.fn(),
  markAsRead: jest.fn(),
}));
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
jest.mock('@/services/comments.service', () => ({
  listComments: jest.fn().mockResolvedValue({
    data: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  }),
  createComment: jest.fn(),
  deleteComment: jest.fn(),
}));

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockNavigation = { replace: mockReplace, navigate: mockNavigate };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({ params: { postId: 'p1', title: 'Post' } }),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockGetById = postsService.getPostById as jest.Mock;
const mockHasRead = readsService.hasReadPost as jest.Mock;

const guest = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const teacher = {
  user: { id: 't1', login: 'joao.silva', role: 'TEACHER' as const },
  profile: null,
  isAuthenticated: true,
  isHydrating: false,
  isAuthenticating: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const publishedPost = {
  id: 'p1',
  title: 'Post Teste',
  content: 'Conteúdo do post',
  status: 'PUBLISHED',
  published_at: '2026-01-01',
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  author: {
    id: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
    name: 'Prof João',
    pronouns: 'ele/dele',
  },
  discipline: { id: 'd1', label: 'Matemática' },
  comments_count: 0,
  reads_count: 0,
};

describe('PostDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasRead.mockResolvedValue(false);
  });

  it('renders published post with author + pronouns for guest', async () => {
    useAuthSpy.mockReturnValue(guest);
    mockGetById.mockResolvedValueOnce(publishedPost);

    const { findByText } = render(<PostDetailScreen />);
    expect(await findByText('Post Teste')).toBeTruthy();
    expect(await findByText('Conteúdo do post')).toBeTruthy();
    expect(await findByText('Prof João (ele/dele)')).toBeTruthy();
  });

  it('redirects to Home when post is DRAFT and viewer is not TEACHER', async () => {
    useAuthSpy.mockReturnValue(guest);
    mockGetById.mockResolvedValueOnce({ ...publishedPost, status: 'DRAFT' });

    render(<PostDetailScreen />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
  });

  it('does NOT redirect when post is DRAFT and viewer is TEACHER', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockGetById.mockResolvedValueOnce({ ...publishedPost, status: 'DRAFT' });

    const { findByText } = render(<PostDetailScreen />);
    expect(await findByText('Post Teste')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
