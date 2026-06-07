import React from 'react';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
import { CommentForm } from '@/features/comments/components/CommentForm';

describe('CommentForm', () => {
  it('shows validation error for empty content', async () => {
    const onSubmit = jest.fn();
    const { getByText, findByText } = render(
      <CommentForm onSubmit={onSubmit} />
    );
    fireEvent.press(getByText('Publicar comentário'));
    expect(await findByText('Escreva algo antes de enviar.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed content on valid submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByText, getByPlaceholderText } = render(
      <CommentForm onSubmit={onSubmit} />
    );

    fireEvent.changeText(
      getByPlaceholderText('Escreva sua opinião...'),
      '   olá pessoal   '
    );

    await act(async () => {
      fireEvent.press(getByText('Publicar comentário'));
    });

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'olá pessoal' })
      )
    );
  });
});
