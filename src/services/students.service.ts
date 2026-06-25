import axios from 'axios';
import { apiClient, API_BASE_URL } from '@/api/client';
import type { PaginatedResponse, Status, Student } from '@/types/api';
import type {
  StudentFormData,
  StudentSignupData,
} from '@/features/students/validators/student.schema';

const DEFAULT_LIMIT = 20;

interface ListStudentsParams {
  name?: string;
  status?: Status;
  page?: number;
  limit?: number;
}

export async function listStudents(
  params: ListStudentsParams = {}
): Promise<PaginatedResponse<Student>> {
  const searchParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_LIMIT,
  };
  if (params.name) searchParams.name = params.name;
  if (params.status) searchParams.status = params.status;

  const { data } = await apiClient.get<PaginatedResponse<Student>>(
    '/students',
    { params: searchParams }
  );
  return data;
}

export async function getStudentById(id: string): Promise<Student> {
  const { data } = await apiClient.get<Student>(`/students/${id}`);
  return data;
}

export async function getMyStudent(): Promise<Student> {
  const { data } = await apiClient.get<Student>('/students/me');
  return data;
}

function buildStudentBody(payload: Partial<StudentFormData>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name;
  if (payload.email !== undefined) body.email = payload.email;
  if (payload.birth_date !== undefined) body.birth_date = payload.birth_date;
  if (payload.pronouns !== undefined) body.pronouns = payload.pronouns;
  if (payload.biography !== undefined) body.biography = payload.biography;
  if (payload.course !== undefined) body.course = payload.course;
  if (payload.user !== undefined) body.user = payload.user;
  return body;
}

export async function createStudent(payload: StudentFormData): Promise<Student> {
  const { data } = await apiClient.post<Student>('/students', buildStudentBody(payload));
  return data;
}

export async function updateStudent(
  id: string,
  payload: Partial<StudentFormData>
): Promise<Student> {
  const { data } = await apiClient.patch<Student>(
    `/students/${id}`,
    buildStudentBody(payload)
  );
  return data;
}

export async function deleteStudent(id: string): Promise<void> {
  await apiClient.delete(`/students/${id}`);
}

export async function reactivateStudent(id: string): Promise<Student> {
  const { data } = await apiClient.patch<Student>(
    `/students/${id}`,
    { status: 'ATIVO' }
  );
  return data;
}

/**
 * Auto-cadastro público — usa axios cru para garantir que NENHUM
 * Authorization header seja enviado (caso STUDENT esteja logado, o
 * apiClient interceptor adicionaria o Bearer e o backend retornaria
 * 403 "STUDENT logado não pode se auto-cadastrar").
 */
export async function signupStudent(payload: StudentSignupData): Promise<Student> {
  const { data } = await axios.post<Student>(
    `${API_BASE_URL}/students`,
    buildStudentBody(payload)
  );
  return data;
}
