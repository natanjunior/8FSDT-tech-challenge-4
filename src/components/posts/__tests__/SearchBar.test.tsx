import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { SearchBar } from '@/components/posts/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onDebouncedChange={() => {}} />
    );
    expect(getByPlaceholderText('Buscar por título ou conteúdo...')).toBeTruthy();
  });

  it('debounces the change callback', () => {
    const onDebouncedChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onDebouncedChange={onDebouncedChange} />
    );

    fireEvent.changeText(getByPlaceholderText('Buscar por título ou conteúdo...'), 'al');
    expect(onDebouncedChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(399);
    });
    expect(onDebouncedChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onDebouncedChange).toHaveBeenCalledWith('al');
  });

  it('does not fire callback when text below min chars (2)', () => {
    const onDebouncedChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onDebouncedChange={onDebouncedChange} />
    );
    fireEvent.changeText(getByPlaceholderText('Buscar por título ou conteúdo...'), 'a');
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onDebouncedChange).not.toHaveBeenCalled();
  });

  it('fires callback with empty string when input is cleared', () => {
    const onDebouncedChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="something" onDebouncedChange={onDebouncedChange} />
    );
    fireEvent.changeText(getByPlaceholderText('Buscar por título ou conteúdo...'), '');
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(onDebouncedChange).toHaveBeenCalledWith('');
  });

  it('renders magnify icon (search affordance)', () => {
    const { getByTestId } = render(
      <SearchBar value="" onDebouncedChange={() => {}} testID="sb" />
    );
    expect(getByTestId('sb-leading-icon')).toBeTruthy();
  });
});
