import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useRequireRole } from '@/hooks/useRequireRole';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { AuthorId } from '@/components/ui/AuthorId';
import { SearchBar } from '@/components/posts/SearchBar';
import {
  listStudents,
  deleteStudent,
  reactivateStudent,
} from '@/services/students.service';
import { colors } from '@/theme/colors';
import type { Status, Student } from '@/types/api';
import type { RootStackNavigationProp } from '@/navigation/types';

const STATUS_OPTIONS: Array<{ value: Status | null; label: string; dotClass: string }> = [
  { value: null, label: 'TODOS', dotClass: 'bg-outline' },
  { value: 'ATIVO', label: 'ATIVOS', dotClass: 'bg-status-published' },
  { value: 'INATIVO', label: 'INATIVOS', dotClass: 'bg-status-archived' },
];

function StatusFilter({
  value,
  onChange,
}: {
  value: Status | null;
  onChange: (next: Status | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
    >
      {STATUS_OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.label}
            accessibilityRole="button"
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            className={`flex-row items-center gap-1.5 rounded-full px-3 py-1.5 ${
              selected ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <View className={`h-1.5 w-1.5 rounded-full ${opt.dotClass}`} />
            <Text
              className={`font-sans-bold text-[10px] uppercase tracking-wider ${
                selected ? 'text-primary-foreground' : 'text-foreground'
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

interface ItemProps {
  student: Student;
  onPressEdit: (s: Student) => void;
  onPressDelete: (s: Student) => void;
  onPressReactivate: (s: Student) => void;
}

function StudentItem({ student, onPressEdit, onPressDelete, onPressReactivate }: ItemProps) {
  const inactive = student.status === 'INATIVO';
  const courseLabel = student.course ?? 'Sem curso';

  return (
    <View style={{ opacity: inactive ? 0.6 : 1 }}>
      <Card>
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 gap-2">
            <AuthorId name={student.name} subtitle={courseLabel} size="md" />
            <View
              className={`self-start flex-row items-center gap-1.5 rounded-full px-2.5 py-0.5 ${
                inactive ? 'bg-status-archived/10' : 'bg-status-published/10'
              }`}
            >
              <View
                className={`h-1.5 w-1.5 rounded-full ${
                  inactive ? 'bg-status-archived' : 'bg-status-published'
                }`}
              />
              <Text
                className={`font-sans-bold text-[10px] ${
                  inactive ? 'text-status-archived' : 'text-status-published'
                }`}
              >
                {inactive ? 'INATIVO' : 'ATIVO'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1">
            {inactive ? (
              <TouchableOpacity
                onPress={() => onPressReactivate(student)}
                hitSlop={8}
                className="rounded-lg bg-primary/10 px-3 py-2"
              >
                <Text className="font-sans-bold text-xs text-primary">Reativar</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  testID={`student-${student.id}-edit-btn`}
                  onPress={() => onPressEdit(student)}
                  hitSlop={8}
                  className="h-9 w-9 items-center justify-center rounded-lg"
                >
                  <Icon name="pencil-outline" size={18} color={colors.outline} />
                </TouchableOpacity>
                <TouchableOpacity
                  testID={`student-${student.id}-delete-btn`}
                  onPress={() => onPressDelete(student)}
                  hitSlop={8}
                  className="h-9 w-9 items-center justify-center rounded-lg"
                >
                  <Icon name="trash-can-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Card>
    </View>
  );
}

export function StudentsListScreen() {
  const allowed = useRequireRole('TEACHER');
  const navigation = useNavigation<RootStackNavigationProp>();

  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [nameQuery, setNameQuery] = useState('');

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean) => {
      try {
        const res = await listStudents({
          page: targetPage,
          limit: 20,
          ...(nameQuery ? { name: nameQuery } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        });
        setStudents((prev) => (append ? [...prev, ...res.data] : res.data));
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar alunos',
          text2: err?.response?.data?.error ?? 'Tente novamente.',
        });
      }
    },
    [nameQuery, statusFilter]
  );

  useEffect(() => {
    if (!allowed) return;
    setIsLoading(true);
    fetchPage(1, false).finally(() => setIsLoading(false));
  }, [allowed, fetchPage]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPage(1, false);
    setIsRefreshing(false);
  }, [fetchPage]);

  const onLoadMore = useCallback(async () => {
    if (isLoadingMore || page >= totalPages) return;
    setIsLoadingMore(true);
    await fetchPage(page + 1, true);
    setIsLoadingMore(false);
  }, [fetchPage, isLoadingMore, page, totalPages]);

  const onConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteStudent(pendingDelete.id);
      Toast.show({ type: 'success', text1: 'Aluno desativado.' });
      setPendingDelete(null);
      await fetchPage(1, false);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao desativar',
        text2: err?.response?.data?.error ?? 'Tente novamente.',
      });
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, fetchPage]);

  const onReactivate = useCallback(
    async (s: Student) => {
      try {
        await reactivateStudent(s.id);
        Toast.show({ type: 'success', text1: 'Aluno reativado.' });
        await fetchPage(1, false);
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao reativar',
          text2: err?.response?.data?.error ?? 'Tente novamente.',
        });
      }
    },
    [fetchPage]
  );

  if (!allowed) return null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-row items-center justify-between px-4 pb-3 pt-4">
        <View className="flex-row items-center gap-2">
          <Icon name="account-outline" size={22} color={colors.primary} />
          <Text className="font-sans-black text-xl text-primary">Alunos</Text>
        </View>
        <Button
          title="Novo aluno"
          leadingIcon="plus"
          size="sm"
          onPress={() => navigation.navigate('StudentCreate')}
        />
      </View>

      <View className="gap-3 pb-3">
        <View className="px-4">
          <SearchBar value={nameQuery} onDebouncedChange={setNameQuery} />
        </View>
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </View>

      {isLoading ? (
        <Loader fullScreen message="Carregando alunos..." />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <StudentItem
              student={item}
              onPressEdit={(s) => navigation.navigate('StudentEdit', { id: s.id })}
              onPressDelete={(s) => setPendingDelete(s)}
              onPressReactivate={(s) => onReactivate(s)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="account-outline"
              title="Nenhum aluno encontrado"
              subtitle="Crie um novo pelo botão acima."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingMore ? <Loader message="Carregando mais..." /> : null}
        />
      )}

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Desativar aluno?"
        description={
          pendingDelete
            ? `${pendingDelete.name} será marcado como INATIVO e perderá acesso ao sistema. A credencial será liberada para reuso.`
            : ''
        }
        confirmLabel="Desativar"
        cancelLabel="Cancelar"
        variant="destructive"
        onConfirm={onConfirmDelete}
        onCancel={() => setPendingDelete(null)}
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}
