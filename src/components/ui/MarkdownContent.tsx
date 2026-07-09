import React from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import { colors } from '@/theme/colors';

interface MarkdownContentProps {
  value: string;
  testID?: string;
}

// @ronradtke/react-native-markdown-display estiliza via objeto StyleSheet (chaves por elemento),
// NÃO via NativeWind className. Este é o único ponto do app fora do className.
// Mapeamento espelha o `prose`->tokens da web (Fase 3). Fontes são as carregadas no App.tsx.
const markdownStyles = StyleSheet.create({
  body: {
    color: colors.foreground,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 28,
  },
  heading1: { color: colors.primary, fontSize: 28, fontWeight: '800', marginTop: 8, marginBottom: 4 },
  heading2: { color: colors.primary, fontSize: 24, fontWeight: '800', marginTop: 8, marginBottom: 4 },
  heading3: { color: colors.primary, fontSize: 20, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  heading4: { color: colors.primary, fontSize: 18, fontWeight: '700' },
  heading5: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  heading6: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  link: { color: colors.primary, textDecorationLine: 'underline' },
  blockquote: {
    backgroundColor: colors.surfaceContainerLow,
    borderLeftColor: colors.outline,
    borderLeftWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: colors.muted,
  },
  code_inline: {
    fontFamily: 'JetBrainsMono_400Regular',
    backgroundColor: colors.surfaceContainerLow,
    color: colors.foreground,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  fence: {
    fontFamily: 'JetBrainsMono_400Regular',
    backgroundColor: colors.surfaceContainerLow,
    color: colors.foreground,
    borderRadius: 8,
    padding: 12,
  },
  code_block: {
    fontFamily: 'JetBrainsMono_400Regular',
    backgroundColor: colors.surfaceContainerLow,
    color: colors.foreground,
    borderRadius: 8,
    padding: 12,
  },
  hr: { backgroundColor: colors.outlineVariant, height: StyleSheet.hairlineWidth },
  bullet_list_icon: { color: colors.muted },
  ordered_list_icon: { color: colors.muted },
});

export function MarkdownContent({ value, testID }: MarkdownContentProps) {
  return (
    <View testID={testID}>
      <Markdown style={markdownStyles}>{value ?? ''}</Markdown>
    </View>
  );
}
