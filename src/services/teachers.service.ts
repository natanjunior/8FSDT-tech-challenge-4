import { apiClient } from '@/api/client';
import type { PaginatedResponse, Status, Teacher } from '@/types/api';
import type { TeacherFormData } from '@/features/teachers/validators/teacher.schema';

const DEFAULT_LIMIT = 20;

interface ListTeachersParams {
  name?: string;
  status?: Status;
  page?: number;
  limit?: number;
}

export async function listTeachers(
  params: ListTeachersParams = {}
): Promise<PaginatedResponse<Teacher>> {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_LIMIT,
  };
  if (params.name) searchParams.name = params.name;
  if (params.status) searchParams.status = params.status;

  const { data } = await apiClient.get<PaginatedResponse<Teacher>>(
    '/teachers',
    { params: searchParams }
  );
  return data;
}

export async function getTeacherById(id: string): Promise<Teacher> {
  const { data } = await apiClient.get<Teacher>(`/teachers/${id}`);
  return data;
}

function buildTeacherBody(payload: Partial<TeacherFormData>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.email !== undefined) body.email = payload.email;
  if (payload.birth_date !== undefined) body.birth_date = payload.birth_date;
  if (payload.pronouns !== undefined) body.pronouns = payload.pronouns;
  if (payload.biography !== undefined) body.biography = payload.biography;
  if (payload.discipline_ids !== undefined) body.discipline_ids = payload.discipline_ids;
  if (payload.user !== undefined) body.user = payload.user;
  return body;
}

export async function createTeacher(payload: TeacherFormData): Promise<Teacher> {
  const { data } = await apiClient.post<Teacher>('/teachers', buildTeacherBody(payload));
  return data;
}

export async function updateTeacher(
  id: string,
  payload: Partial<TeacherFormData>
): Promise<Teacher> {
  const { data } = await apiClient.patch<Teacher>(
    `/teachers/${id}`,
    buildTeacherBody(payload)
  );
  return data;
}

export async function deleteTeacher(id: string): Promise<void> {
  await apiClient.delete(`/teachers/${id}`);
}

export async function reactivateTeacher(id: string): Promise<Teacher> {
  const { data } = await apiClient.patch<Teacher>(
    `/teachers/${id}`,
    { status: 'ATIVO' }
  );
  return data;
}
