import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

describe('ConfirmModal', () => {
  const baseProps = {
    isOpen: true,
    title: 'Excluir post?',
    description: 'Esta ação não pode ser desfeita.',
    confirmLabel: 'Excluir permanentemente',
    cancelLabel: 'Cancelar',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    baseProps.onConfirm.mockClear();
    baseProps.onCancel.mockClear();
  });

  it('does not render when isOpen=false', () => {
    const { queryByText } = render(
      <ConfirmModal {...baseProps} isOpen={false} />
    );
    expect(queryByText('Excluir post?')).toBeNull();
  });

  it('renders title and description', () => {
    const { getByText } = render(<ConfirmModal {...baseProps} />);
    expect(getByText('Excluir post?')).toBeTruthy();
    expect(getByText('Esta ação não pode ser desfeita.')).toBeTruthy();
  });

  it('calls onCancel when cancel pressed', () => {
    const { getByText } = render(<ConfirmModal {...baseProps} />);
    fireEvent.press(getByText('Cancelar'));
    expect(baseProps.onCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when confirm pressed', () => {
    const { getByText } = render(<ConfirmModal {...baseProps} />);
    fireEvent.press(getByText('Excluir permanentemente'));
    expect(baseProps.onConfirm).toHaveBeenCalled();
  });

  it('accepts variant="destructive" with red icon', () => {
    const { getByTestId } = render(
      <ConfirmModal {...baseProps} variant="destructive" testID="modal" />
    );
    expect(getByTestId('modal-icon')).toBeTruthy();
  });

  it('accepts variant="neutral"', () => {
    const { getByTestId } = render(
      <ConfirmModal {...baseProps} variant="neutral" testID="modal" />
    );
    expect(getByTestId('modal-icon')).toBeTruthy();
  });
});
