import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { markAsRead } from '@/services/reads.service';

interface MarkAsReadButtonProps {
  postId: string;
  initialHasRead?: boolean;
  /** Chamado uma única vez após a marcação ser confirmada pelo backend.
   *  Permite à tela dona incrementar o contador de leituras na hora. */
  onMarked?: () => void;
}

export function MarkAsReadButton({
  postId,
  initialHasRead = false,
  onMarked,
}: MarkAsReadButtonProps) {
  const { isAuthenticated } = useAuth();
  const [hasRead, setHasRead] = useState(initialHasRead);
  const [isPending, setIsPending] = useState(false);

  if (!isAuthenticated) return null;

  const handlePress = async () => {
    if (hasRead || isPending) return;
    setHasRead(true);
    setIsPending(true);
    try {
      await markAsRead(postId);
      onMarked?.();
    } catch {
      setHasRead(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      title={hasRead ? 'Marcado como lido' : 'Marcar como lido'}
      variant={hasRead ? 'secondary' : 'primary'}
      size="md"
      leadingIcon={hasRead ? 'bookmark-check' : 'bookmark-outline'}
      onPress={handlePress}
      disabled={isPending || hasRead}
      loading={isPending}
    />
  );
}
