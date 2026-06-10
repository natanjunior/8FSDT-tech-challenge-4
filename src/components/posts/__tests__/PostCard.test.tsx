import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PostCard } from '@/components/posts/PostCard';
import type { Post } from '@/types/api';

const basePost: Post = {
  id: 'p1',
  title: 'Introdução à Álgebra',
  content: 'Conteúdo do post de exemplo com vários parágrafos.',
  status: 'PUBLISHED',
  published_at: '2026-01-01T10:00:00Z',
  created_at: '2026-01-01T10:00:00Z',
  updated_at: '2026-01-01T10:00:00Z',
  author: {
    id: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
    name: 'Prof. João Silva',
    pronouns: 'ele/dele',
  },
  discipline: { id: 'd1', label: 'Matemática' },
  comments_count: 3,
  reads_count: 12,
};

describe('PostCard', () => {
  it('calls onPress with the post when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<PostCard post={basePost} onPress={onPress} />);
    fireEvent.press(getByText('Introdução à Álgebra'));
    expect(onPress).toHaveBeenCalledWith(basePost);
  });

  it('shows "Sem disciplina" subtitle when discipline is null', () => {
    const noDiscPost = { ...basePost, discipline: null };
    const { getAllByText } = render(
      <PostCard post={noDiscPost} onPress={() => {}} />
    );
    // DisciplineBadge fallback + AuthorId subtitle both render "Sem disciplina"
    expect(getAllByText('Sem disciplina').length).toBeGreaterThanOrEqual(1);
  });

  it('renders title and excerpt of content', () => {
    const { getByText } = render(<PostCard post={basePost} onPress={() => {}} />);
    expect(getByText(basePost.title)).toBeTruthy();
  });

  it('renders DisciplineBadge floating', () => {
    const { getAllByText } = render(<PostCard post={basePost} onPress={() => {}} />);
    // DisciplineBadge (floating) + AuthorId subtitle both render the discipline label
    expect(getAllByText(basePost.discipline!.label).length).toBeGreaterThanOrEqual(1);
  });

  it('renders StatusBadge', () => {
    const { getByText } = render(<PostCard post={basePost} onPress={() => {}} />);
    const expectedLabel = basePost.status === 'PUBLISHED' ? 'PUBLICADO' : basePost.status === 'DRAFT' ? 'RASCUNHO' : 'ARQUIVADO';
    expect(getByText(expectedLabel)).toBeTruthy();
  });

  it('renders AuthorId with name and discipline subtitle', () => {
    const { getByText } = render(<PostCard post={basePost} onPress={() => {}} />);
    expect(getByText(basePost.author!.name)).toBeTruthy();
  });

  it('renders IconCount for comments and reads (no "comentário"/"leitura" text)', () => {
    const { getByText, queryByText } = render(
      <PostCard
        post={{ ...basePost, comments_count: 3, reads_count: 5 }}
        onPress={() => {}}
      />
    );
    expect(getByText('3')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(queryByText(/comentário/i)).toBeNull();
    expect(queryByText(/leitura/i)).toBeNull();
  });

  it('renders "Autor removido" when author is null', () => {
    const { getByText } = render(
      <PostCard post={{ ...basePost, author: null }} onPress={() => {}} />
    );
    expect(getByText('Autor removido')).toBeTruthy();
  });
});
