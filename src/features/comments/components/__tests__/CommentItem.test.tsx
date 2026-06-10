import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { CommentItem } from '@/features/comments/components/CommentItem';
import type { Comment } from '@/types/api';

const base: Comment = {
  id: 'c1',
  content: 'Ótimo post!',
  author: {
    id: 'Teacher/550e8400-e29b-41d4-a716-446655440001',
    type: 'Teacher',
    name: 'Prof. João',
  },
  can_delete: false,
  created_at: '2026-01-01',
};

describe('CommentItem', () => {
  it('renders content, author name and author type label', () => {
    const { getByText } = render(<CommentItem comment={base} testID="ci" />);
    expect(getByText('Prof. João')).toBeTruthy();
    expect(getByText('· Professor')).toBeTruthy();
    expect(getByText('Ótimo post!')).toBeTruthy();
  });

  it('renders "Aluno" label when author.type is Student', () => {
    const studentComment: Comment = {
      ...base,
      author: { id: 'Student/abc', type: 'Student', name: 'Pedro' },
    };
    const { getByText } = render(
      <CommentItem comment={studentComment} testID="ci" />
    );
    expect(getByText('· Aluno')).toBeTruthy();
  });

  it('renders "Autor removido" when author is null', () => {
    const { getByText } = render(
      <CommentItem comment={{ ...base, author: null }} testID="ci" />
    );
    expect(getByText('Autor removido')).toBeTruthy();
  });

  it('renders avatar with person icon (not initials)', () => {
    const { getByTestId, queryByText } = render(
      <CommentItem comment={base} testID="ci" />
    );
    expect(getByTestId('ci-avatar-icon')).toBeTruthy();
    expect(queryByText(/^[A-Z]{1,2}$/)).toBeNull();
  });

  it('renders delete as icon (trash-can) when can_delete=true', () => {
    const onDelete = jest.fn();
    const { getByTestId, queryByText } = render(
      <CommentItem
        comment={{ ...base, can_delete: true }}
        onDelete={onDelete}
        testID="ci"
      />
    );
    expect(getByTestId('ci-delete-icon')).toBeTruthy();
    expect(queryByText('Excluir')).toBeNull();
    fireEvent.press(getByTestId('ci-delete-icon'));
    expect(onDelete).toHaveBeenCalledWith(base.id);
  });

  it('hides delete button when can_delete is false', () => {
    const { queryByText, queryByTestId } = render(
      <CommentItem comment={base} onDelete={jest.fn()} testID="ci" />
    );
    expect(queryByText('Excluir')).toBeNull();
    expect(queryByTestId('ci-delete-icon')).toBeNull();
  });
});
