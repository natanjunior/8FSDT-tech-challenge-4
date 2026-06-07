import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StatusPicker } from '@/components/posts/StatusPicker';

describe('StatusPicker', () => {
  it('renders all three statuses', () => {
    const { getByText } = render(
      <StatusPicker value="DRAFT" onChange={() => {}} />
    );
    expect(getByText('Rascunho')).toBeTruthy();
    expect(getByText('Publicado')).toBeTruthy();
    expect(getByText('Arquivado')).toBeTruthy();
  });

  it('calls onChange when a different status is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <StatusPicker value="DRAFT" onChange={onChange} />
    );
    fireEvent.press(getByText('Publicado'));
    expect(onChange).toHaveBeenCalledWith('PUBLISHED');
  });

  it('passes the correct value for ARCHIVED', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <StatusPicker value="DRAFT" onChange={onChange} />
    );
    fireEvent.press(getByText('Arquivado'));
    expect(onChange).toHaveBeenCalledWith('ARCHIVED');
  });
});
