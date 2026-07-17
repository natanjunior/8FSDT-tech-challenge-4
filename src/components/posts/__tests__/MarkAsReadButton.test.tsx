import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { MarkAsReadButton } from '@/components/posts/MarkAsReadButton';
import * as AuthContextModule from '@/contexts/AuthContext';
import * as readsService from '@/services/reads.service';

jest.mock('@/services/reads.service', () => ({
  markAsRead: jest.fn(),
  hasReadPost: jest.fn(),
}));

const useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth');
const mockMark = readsService.markAsRead as jest.Mock;

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

describe('MarkAsReadButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not authenticated', () => {
    useAuthSpy.mockReturnValue(guest);
    const { toJSON } = render(
      <MarkAsReadButton postId="p1" initialHasRead={false} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders "Marcar como lido" when authenticated and not read', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByText } = render(
      <MarkAsReadButton postId="p1" initialHasRead={false} />
    );
    expect(getByText('Marcar como lido')).toBeTruthy();
  });

  it('renders "Marcado como lido" when initialHasRead is true', () => {
    useAuthSpy.mockReturnValue(teacher);
    const { getByText } = render(
      <MarkAsReadButton postId="p1" initialHasRead={true} />
    );
    expect(getByText('Marcado como lido')).toBeTruthy();
  });

  it('optimistically marks and calls service when pressed', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockMark.mockResolvedValueOnce({
      id: 'r1', post_id: 'p1', reader: 'Teacher/550e8400-e29b-41d4-a716-446655440001', read_at: '2026-01-01',
    });

    const { getByText } = render(
      <MarkAsReadButton postId="p1" initialHasRead={false} />
    );

    await act(async () => {
      fireEvent.press(getByText('Marcar como lido'));
    });

    expect(getByText('Marcado como lido')).toBeTruthy();
    expect(mockMark).toHaveBeenCalledWith('p1');
  });

  it('rolls back state on error', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockMark.mockRejectedValueOnce(new Error('500'));

    const { getByText, queryByText } = render(
      <MarkAsReadButton postId="p1" initialHasRead={false} />
    );

    await act(async () => {
      fireEvent.press(getByText('Marcar como lido'));
    });

    expect(getByText('Marcar como lido')).toBeTruthy();
    expect(queryByText('Marcado como lido')).toBeNull();
  });

  it('calls onMarked once after a successful mark', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockMark.mockResolvedValueOnce({
      id: 'r1', post_id: 'p1', reader: 'Teacher/550e8400-e29b-41d4-a716-446655440001', read_at: '2026-01-01',
    });
    const onMarked = jest.fn();

    const { getByText } = render(
      <MarkAsReadButton postId="p1" initialHasRead={false} onMarked={onMarked} />
    );

    await act(async () => {
      fireEvent.press(getByText('Marcar como lido'));
    });

    expect(onMarked).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onMarked when the mark fails', async () => {
    useAuthSpy.mockReturnValue(teacher);
    mockMark.mockRejectedValueOnce(new Error('500'));
    const onMarked = jest.fn();

    const { getByText } = render(
      <MarkAsReadButton postId="p1" initialHasRead={false} onMarked={onMarked} />
    );

    await act(async () => {
      fireEvent.press(getByText('Marcar como lido'));
    });

    expect(onMarked).not.toHaveBeenCalled();
  });
});
