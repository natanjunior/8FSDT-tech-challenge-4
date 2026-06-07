import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '@/screens/HomeScreen';
import * as postsService from '@/services/posts.service';
import * as disciplinesService from '@/services/disciplines.service';

jest.mock('@/services/posts.service');
jest.mock('@/services/disciplines.service');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const mockList = postsService.listPosts as jest.Mock;
const mockListDisciplines = disciplinesService.listDisciplines as jest.Mock;

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockListDisciplines.mockResolvedValue([]);
  });

  it('renders posts after load', async () => {
    mockList.mockResolvedValueOnce({
      data: [
        {
          id: 'p1',
          title: 'Post Um',
          content: 'oi',
          status: 'PUBLISHED',
          published_at: '2026-01-01',
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
          author: {
            id: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
            name: 'Prof',
            pronouns: 'ele/dele',
          },
          discipline: { id: 'd1', label: 'Matemática' },
          comments_count: 0,
          reads_count: 0,
        },
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });

    const { findByText } = render(<HomeScreen />);
    expect(await findByText('Post Um')).toBeTruthy();
  });

  it('renders empty state when no posts', async () => {
    mockList.mockResolvedValueOnce({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    });
    const { findByText } = render(<HomeScreen />);
    expect(await findByText('Nenhum post encontrado')).toBeTruthy();
  });

  it('renders error state and retry button on fetch failure', async () => {
    mockList.mockRejectedValueOnce(new Error('network'));
    const { findByText } = render(<HomeScreen />);
    expect(await findByText('Erro ao carregar')).toBeTruthy();
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));
  });
});
