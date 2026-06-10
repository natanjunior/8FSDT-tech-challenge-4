import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StatusPicker } from '@/components/posts/StatusPicker';

describe('StatusPicker', () => {
  it('renders all three statuses', () => {
    const { getByText } = render(
      <StatusPicker value="DRAFT" onChange={() => {}} />
    );
    expect(getByText('RASCUNHO')).toBeTruthy();
    expect(getByText('PUBLICADO')).toBeTruthy();
    expect(getByText('ARQUIVADO')).toBeTruthy();
  });

  it('calls onChange when a different status is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <StatusPicker value="DRAFT" onChange={onChange} />
    );
    fireEvent.press(getByText('PUBLICADO'));
    expect(onChange).toHaveBeenCalledWith('PUBLISHED');
  });

  it('passes the correct value for ARCHIVED', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <StatusPicker value="DRAFT" onChange={onChange} />
    );
    fireEvent.press(getByText('ARQUIVADO'));
    expect(onChange).toHaveBeenCalledWith('ARCHIVED');
  });

  it('renders a dot for each status option', () => {
    const { getByTestId } = render(
      <StatusPicker value="DRAFT" onChange={() => {}} />
    );
    expect(getByTestId('status-DRAFT-dot')).toBeTruthy();
    expect(getByTestId('status-PUBLISHED-dot')).toBeTruthy();
    expect(getByTestId('status-ARCHIVED-dot')).toBeTruthy();
  });
});
