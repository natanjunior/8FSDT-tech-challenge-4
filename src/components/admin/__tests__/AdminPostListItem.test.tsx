import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { AdminPostListItem } from '@/components/admin/AdminPostListItem';
import type { Post } from '@/types/api';

const basePost: Post = {
  id: 'p1',
  title: 'Introdução à Álgebra Linear',
  content: 'Conteúdo do post com mais de dez caracteres.',
  status: 'DRAFT',
  published_at: null,
  created_at: '2026-05-10T10:00:00Z',
  updated_at: '2026-06-01T15:00:00Z',
  author: {
    id: 'Teacher/abc',
    name: 'João Silva',
    pronouns: 'ele/dele',
  },
  discipline: { id: 'd1', label: 'Matemática' },
  comments_count: 3,
  reads_count: 5,
};

describe('AdminPostListItem', () => {
  it('renders title, discipline, status, author, counts', () => {
    const { getByText, getAllByText } = render(
      <AdminPostListItem
        post={basePost}
        onPressEdit={() => {}}
        onPressDelete={() => {}}
        onPressItem={() => {}}
      />
    );
    expect(getByText(basePost.title)).toBeTruthy();
    // 'Matemática' appears twice (DisciplineBadge + AuthorId subtitle) — assert at least one.
    expect(getAllByText('Matemática').length).toBeGreaterThan(0);
    expect(getByText('RASCUNHO')).toBeTruthy();
    expect(getByText(basePost.author!.name)).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('renders "Autor removido" placeholder when author is null', () => {
    const { getByText } = render(
      <AdminPostListItem
        post={{ ...basePost, author: null }}
        onPressEdit={() => {}}
        onPressDelete={() => {}}
        onPressItem={() => {}}
      />
    );
    expect(getByText('Autor removido')).toBeTruthy();
  });

  it('invokes onPressEdit when pencil button pressed', () => {
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <AdminPostListItem
        post={basePost}
        onPressEdit={onEdit}
        onPressDelete={() => {}}
        onPressItem={() => {}}
        testID="item"
      />
    );
    fireEvent.press(getByTestId('item-edit-btn'));
    expect(onEdit).toHaveBeenCalledWith(basePost);
  });

  it('invokes onPressDelete when trash button pressed', () => {
    const onDelete = jest.fn();
    const { getByTestId } = render(
      <AdminPostListItem
        post={basePost}
        onPressEdit={() => {}}
        onPressDelete={onDelete}
        onPressItem={() => {}}
        testID="item"
      />
    );
    fireEvent.press(getByTestId('item-delete-btn'));
    expect(onDelete).toHaveBeenCalledWith(basePost);
  });

  it('invokes onPressItem when title area is pressed (not the action buttons)', () => {
    const onItem = jest.fn();
    const { getByTestId } = render(
      <AdminPostListItem
        post={basePost}
        onPressEdit={() => {}}
        onPressDelete={() => {}}
        onPressItem={onItem}
        testID="item"
      />
    );
    fireEvent.press(getByTestId('item-content'));
    expect(onItem).toHaveBeenCalledWith(basePost);
  });
});
