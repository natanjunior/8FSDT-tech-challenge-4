import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useRequireRole } from '@/hooks/useRequireRole';
import { PostForm } from '@/features/posts/components/PostForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { getPostById, updatePost } from '@/services/posts.service';
import type { PostFormData } from '@/features/posts/validators/post.schema';
import type { RootStackNavigationProp, PostEditRouteProp } from '@/navigation/types';
import type { Post } from '@/types/api';

export function PostEditScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<PostEditRouteProp>();
  const { postId } = route.params;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      try {
        const fetched = await getPostById(postId);
        if (!cancelled) setPost(fetched);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [allowed, postId]);

  if (!allowed) return null;

  if (isLoading) {
    return <Loader fullScreen message="Carregando post..." />;
  }

  if (notFound || !post) {
    return (
      <EmptyState
        title="Post não encontrado"
        action={{ label: 'Voltar', onPress: () => navigation.goBack() }}
      />
    );
  }

  const handleSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      await updatePost(postId, data);
      Toast.show({ type: 'success', text1: 'Post atualizado.' });
      navigation.goBack();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Sem permissão',
          text2: 'Apenas professores podem editar posts.',
        });
        navigation.replace('Home');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao salvar',
          text2: err?.response?.data?.error ?? 'Tente novamente.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <PostForm
          submitLabel="Salvar alterações"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          defaultValues={{
            title: post.title,
            content: post.content,
            status: post.status,
            discipline_id: post.discipline?.id,
          }}
        />
      </View>
    </ScrollView>
  );
}
