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
    const { getByText } = render(<CommentItem comment={base} />);
    expect(getByText('Prof. João')).toBeTruthy();
    expect(getByText('· Professor')).toBeTruthy();
    expect(getByText('Ótimo post!')).toBeTruthy();
  });

  it('renders "Aluno" label when author.type is Student', () => {
    const studentComment: Comment = {
      ...base,
      author: { id: 'Student/abc', type: 'Student', name: 'Pedro' },
    };
    const { getByText } = render(<CommentItem comment={studentComment} />);
    expect(getByText('· Aluno')).toBeTruthy();
  });

  it('renders "Autor removido" when author is null', () => {
    const { getByText } = render(
      <CommentItem comment={{ ...base, author: null }} />
    );
    expect(getByText('Autor removido')).toBeTruthy();
  });

  it('shows delete button when can_delete and onDelete provided', () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <CommentItem
        comment={{ ...base, can_delete: true }}
        onDelete={onDelete}
      />
    );
    fireEvent.press(getByText('Excluir'));
    expect(onDelete).toHaveBeenCalledWith('c1');
  });

  it('hides delete button when can_delete is false', () => {
    const { queryByText } = render(
      <CommentItem comment={base} onDelete={jest.fn()} />
    );
    expect(queryByText('Excluir')).toBeNull();
  });
});
