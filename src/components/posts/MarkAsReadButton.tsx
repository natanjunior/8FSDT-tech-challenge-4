import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { markAsRead } from '@/services/reads.service';

interface MarkAsReadButtonProps {
  postId: string;
  initialHasRead?: boolean;
}

export function MarkAsReadButton({
  postId,
  initialHasRead = false,
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
    } catch {
      setHasRead(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      title={hasRead ? 'Marcado como lido' : 'Marcar como lido'}
      onPress={handlePress}
      variant={hasRead ? 'secondary' : 'primary'}
      disabled={hasRead}
    />
  );
}
