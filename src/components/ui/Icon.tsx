import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '@/theme/colors';

/**
 * Subset dos ícones usados no app, mapeamento aproximado com Material Symbols
 * usados na Fase 3 web (ver docs/fase 3/11-design-system.md). Restringir nomes
 * a uma enum tipada reduz typos em tempo de compilação.
 */
export type IconName =
  // navegação / UI gerais
  | 'magnify'              // ≈ search (web)
  | 'menu'
  | 'chevron-up'
  | 'chevron-down'         // ≈ expand_more
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-right'
  | 'close'
  | 'check'
  | 'alert-circle'
  | 'alert-circle-outline' // ≈ error
  // auth / users
  | 'account'              // ≈ person
  | 'account-outline'
  | 'account-circle'
  | 'account-circle-outline'
  | 'account-group'
  | 'account-group-outline'
  | 'login'
  | 'logout'
  | 'lock-outline'         // ≈ lock
  | 'eye-outline'
  | 'eye-off-outline'
  // admin / posts
  | 'view-dashboard'       // ≈ dashboard
  | 'view-dashboard-outline'
  | 'plus'
  | 'plus-circle'
  | 'pencil-outline'       // ≈ edit
  | 'note-edit-outline'    // ≈ edit_note
  | 'trash-can-outline'    // ≈ delete
  | 'content-save'         // ≈ save
  | 'cog-outline'          // ≈ settings
  | 'filter-variant'       // ≈ filter_list
  | 'dots-vertical'        // ≈ more_vert
  // engajamento
  | 'forum'                // ≈ forum
  | 'forum-outline'
  | 'comment-outline'      // ≈ chat_bubble_outline
  | 'bookmark-outline'     // ≈ bookmark
  | 'bookmark'
  | 'bookmark-check'       // ≈ bookmark_added
  | 'thumb-up-outline'     // ≈ thumb_up
  | 'eye'                  // ≈ visibility
  // states / containers
  | 'inbox-outline'
  | 'book-open-outline'
  | 'check-circle'
  | 'check-circle-outline'
  // disciplinas (mapping em src/lib/disciplines.ts)
  | 'function-variant'     // ≈ functions (Matemática)
  | 'book-open-page-variant-outline' // ≈ menu_book (Português)
  | 'flask-outline'        // ≈ science (Ciências)
  | 'book-clock'           // ≈ history_edu (História)
  | 'earth'                // ≈ public (Geografia)
  | 'school-outline';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  testID?: string;
}

export function Icon({
  name,
  size = 20,
  color = colors.foreground,
  testID,
}: IconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} testID={testID} />;
}
