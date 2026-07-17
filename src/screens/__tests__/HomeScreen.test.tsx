// src/screens/__tests__/HomeScreen.test.tsx
import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { HomeScreen } from '@/screens/HomeScreen';
import * as postsService from '@/services/posts.service';

// params controláveis por teste (prefixo "mock" é permitido no factory do jest.mock)
let mockParams: { disciplineId?: string; disciplineLabel?: string } = {};
const mockSetParams = jest.fn();
const mockNavigate = jest.fn();
// guarda o callback de foco atual para permitir simular um re-foco no teste
const mockFocus: { cb: (() => void | (() => void)) | null } = { cb: null };

jest.mock('@/services/posts.service');
jest.mock('@react-navigation/native', () => {
  const ReactActual = require('react');
  return {
    useNavigation: () => ({ navigate: mockNavigate, setParams: mockSetParams }),
    useRoute: () => ({ params: mockParams }),
    // Espelha o useFocusEffect real e expõe a última cb para simular re-foco.
    useFocusEffect: (cb: () => void | (() => void)) => {
      mockFocus.cb = cb;
      ReactActual.useEffect(cb, [cb]);
    },
  };
});

const mockList = postsService.listPosts as jest.Mock;
const mockSearch = postsService.searchPosts as jest.Mock;

const onePost = {
  data: [
    {
      id: 'p1',
      title: 'Post Um',
      content: 'oi',
      status: 'PUBLISHED',
      published_at: '2026-01-01',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      author: { id: 'Teacher/1', name: 'Prof', pronouns: 'ele/dele' },
      discipline: { id: 'd1', label: 'Ciências' },
      comments_count: 0,
      reads_count: 0,
    },
  ],
  pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
  });

  it('renders posts after load', async () => {
    mockList.mockResolvedValueOnce(onePost);
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

  it('filtra por disciplina quando o param disciplineId está presente', async () => {
    mockParams = { disciplineId: 'd1', disciplineLabel: 'Ciências' };
    mockSearch.mockResolvedValueOnce(onePost);
    const { findByText } = render(<HomeScreen />);
    expect(await findByText('Post Um')).toBeTruthy();
    await waitFor(() =>
      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({ discipline: 'd1' })
      )
    );
  });

  it('mostra a pill com o label da disciplina ativa', async () => {
    mockParams = { disciplineId: 'd1', disciplineLabel: 'Ciências' };
    mockSearch.mockResolvedValueOnce(onePost);
    const { findByText } = render(<HomeScreen />);
    // "Ciências" aparece na pill (findByText resolve após render inicial)
    expect(await findByText('Ciências')).toBeTruthy();
  });

  it('limpa o filtro (setParams undefined) ao tocar no ✕ da pill', async () => {
    mockParams = { disciplineId: 'd1', disciplineLabel: 'Ciências' };
    mockSearch.mockResolvedValue(onePost);
    const { findByTestId } = render(<HomeScreen />);
    fireEvent.press(await findByTestId('active-filter-clear'));
    expect(mockSetParams).toHaveBeenCalledWith({
      disciplineId: undefined,
      disciplineLabel: undefined,
    });
  });

  it('não renderiza mais os chips de disciplina', async () => {
    mockList.mockResolvedValueOnce(onePost);
    const { queryByText } = render(<HomeScreen />);
    // o chip "Todas" era o marcador da fileira de chips
    expect(queryByText('Todas')).toBeNull();
  });

  it('recarrega a lista ao voltar/focar a tela de novo (sem remontar)', async () => {
    mockList.mockResolvedValue(onePost);
    const { findByText } = render(<HomeScreen />);
    await findByText('Post Um');
    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(1));

    // simula "ir pra outra tela e voltar": o mesmo callback de foco dispara de novo
    await act(async () => {
      mockFocus.cb?.();
    });

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(2));
  });
});
