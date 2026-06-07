import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';

interface SearchBarProps {
  value: string;
  onDebouncedChange: (value: string) => void;
  delayMs?: number;
  minChars?: number;
}

export function SearchBar({
  value,
  onDebouncedChange,
  delayMs = 400,
  minChars = 2,
}: SearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const trimmed = local.trim();
    // Allows user to "clear" the search by sending empty string.
    if (trimmed !== '' && trimmed.length < minChars) return;

    const id = setTimeout(() => {
      onDebouncedChange(trimmed);
    }, delayMs);

    return () => clearTimeout(id);
  }, [local, delayMs, minChars, onDebouncedChange]);

  return (
    <Input
      placeholder="Buscar por título ou conteúdo..."
      value={local}
      onChangeText={setLocal}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
    />
  );
}
