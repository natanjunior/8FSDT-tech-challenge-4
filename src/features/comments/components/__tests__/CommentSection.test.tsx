import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { CommentSection } from '@/features/comments/components/CommentSection';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as commentsService from '@/services/comments.service';

jest.mock('@/services/comments.service');
jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockList = commentsService.listComments as jest.Mock;

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

describe('CommentSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Faça login para comentar" when guest', async () => {
    useAuthSpy.mockReturnValue(guest);
    mockList.mockResolvedValueOnce({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
    const { findByText } = render(<CommentSection postId="p1" />);
    expect(await findByText('Faça login para comentar.')).toBeTruthy();
  });

  it('renders the form when authenticated', async () => {
    useAuthSpy.mockReturnValue(student);
    mockList.mockResolvedValueOnce({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
    const { findByText } = render(<CommentSection postId="p1" />);
    expect(await findByText('Publicar comentário')).toBeTruthy();
  });

  it('renders empty state after load when no comments', async () => {
    useAuthSpy.mockReturnValue(guest);
    mockList.mockResolvedValueOnce({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
    const { findByText } = render(<CommentSection postId="p1" />);
    expect(await findByText('Nenhum comentário ainda. Seja o primeiro!')).toBeTruthy();
  });

  it('renders fetched comments', async () => {
    useAuthSpy.mockReturnValue(guest);
    mockList.mockResolvedValueOnce({
      data: [
        {
          id: 'c1',
          content: 'oi',
          author: {
            id: 'Student/550e8400-e29b-41d4-a716-446655440003',
            type: 'Student',
            name: 'Bia',
          },
          can_delete: false,
          created_at: '2026-01-01',
        },
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
    const { findByText } = render(<CommentSection postId="p1" />);
    await waitFor(() => expect(mockList).toHaveBeenCalled());
    expect(await findByText('oi')).toBeTruthy();
    expect(await findByText('Bia')).toBeTruthy();
  });
});
