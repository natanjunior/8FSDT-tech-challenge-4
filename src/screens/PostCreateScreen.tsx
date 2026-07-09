import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useRequireRole } from '@/hooks/useRequireRole';
import { PostForm } from '@/features/posts/components/PostForm';
import { createPost } from '@/services/posts.service';
import type { PostFormData } from '@/features/posts/validators/post.schema';
import type { RootStackNavigationProp } from '@/navigation/types';

export function PostCreateScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!allowed) return null;

  const handleSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      const created = await createPost(data);
      Toast.show({ type: 'success', text1: 'Post criado.' });
      (navigation as any).navigate('PostDetail', {
        postId: created.id,
        title: created.title,
      });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Sem permissão',
          text2: 'Apenas professores podem criar posts.',
        });
        navigation.replace('Home');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar',
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
          onSubmit={handleSubmit}
          submitLabel="Criar post"
          isSubmitting={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}
