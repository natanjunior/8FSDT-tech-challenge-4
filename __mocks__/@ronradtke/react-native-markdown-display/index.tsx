import React from 'react';
import { Text } from 'react-native';

// Mock de @ronradtke/react-native-markdown-display para testes.
// A lib real estiliza via prop `style` e não é transpilada pelo jest (transformIgnorePatterns).
// Aqui renderizamos o texto Markdown recebido (children) dentro de um <Text>,
// para que findByText/getByText encontrem o conteúdo. O prop `style` é ignorado.
export default function Markdown({
  children,
}: {
  children?: React.ReactNode;
  style?: unknown;
}) {
  return <Text>{children}</Text>;
}
