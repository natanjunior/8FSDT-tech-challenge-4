import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { PostCard } from '@/components/posts/PostCard';
import type { Post } from '@/types/api';

const post: Post = {
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
  it('renders title, author, discipline and counts', () => {
    const { getByText } = render(<PostCard post={post} onPress={() => {}} />);
    expect(getByText('Introdução à Álgebra')).toBeTruthy();
    expect(getByText('Prof. João Silva')).toBeTruthy();
    expect(getByText('Matemática')).toBeTruthy();
    expect(getByText('3 comentários')).toBeTruthy();
    expect(getByText('12 leituras')).toBeTruthy();
  });

  it('calls onPress with the post when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<PostCard post={post} onPress={onPress} />);
    fireEvent.press(getByText('Introdução à Álgebra'));
    expect(onPress).toHaveBeenCalledWith(post);
  });

  it('shows "Sem disciplina" when discipline is null', () => {
    const noDiscPost = { ...post, discipline: null };
    const { getByText } = render(
      <PostCard post={noDiscPost} onPress={() => {}} />
    );
    expect(getByText('Sem disciplina')).toBeTruthy();
  });

  it('shows "Autor removido" when author is null (soft delete)', () => {
    const orphanPost = { ...post, author: null };
    const { getByText } = render(
      <PostCard post={orphanPost} onPress={() => {}} />
    );
    expect(getByText('Autor removido')).toBeTruthy();
  });

  it('renders DRAFT badge for non-PUBLISHED posts', () => {
    const draftPost = { ...post, status: 'DRAFT' as const };
    const { getByText } = render(
      <PostCard post={draftPost} onPress={() => {}} />
    );
    expect(getByText('DRAFT')).toBeTruthy();
  });
});
