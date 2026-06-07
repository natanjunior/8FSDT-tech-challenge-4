export type UserRole   = 'TEACHER' | 'STUDENT';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type Pronouns   = 'ele/dele' | 'ela/dela' | 'elu/delu' | 'outro';
export type Status     = 'ATIVO' | 'INATIVO';
export type FhirRef    = string; // 'Teacher/<uuid>' | 'Student/<uuid>'

/** Credencial: o que o backend tem em `users`. Sem name, sem email. */
export interface User {
  id: string;
  login: string;
  role: UserRole;
}

/** Perfil de professor: dados pessoais + disciplinas que leciona. */
export interface Teacher {
  id: FhirRef;
  name: string;
  email: string | null;
  birth_date: string | null;
  pronouns: Pronouns | null;
  biography: string | null;
  status: Status;
  disciplines: Array<{ id: string; label: string }>;
  user?: User | null;
  created_at: string;
  updated_at: string;
}

/** Perfil de aluno: dados pessoais + curso. */
export interface Student {
  id: FhirRef;
  name: string;
  email: string | null;
  birth_date: string | null;
  pronouns: Pronouns | null;
  biography: string | null;
  status: Status;
  course: string | null;
  user?: User | null;
  created_at: string;
  updated_at: string;
}

/**
 * Perfil ativo do usuário logado. Pode ser null se a credencial não
 * tiver perfil associado — caso raro, mas o backend retorna assim.
 */
export type Profile = Teacher | Student | null;

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  profile: Profile;
  token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ApiError {
  error: string;
}

export interface ValidationError {
  errors: Array<{ field: string; message: string }>;
}

// ============================================================
// Posts, Comments, Reads, Discipline e paginação (Fase 2)
// ============================================================

export interface PostAuthor {
  id: FhirRef;
  name: string;
  pronouns: Pronouns | null;
}

export interface Discipline {
  id: string;
  label: string;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author: PostAuthor | null;
  discipline: Discipline | null;
  comments_count: number;
  reads_count: number;
}

export interface CommentAuthor {
  id: FhirRef;
  type: 'Teacher' | 'Student';
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  author: CommentAuthor | null;
  can_delete: boolean;
  created_at: string;
}

export interface Read {
  id: string;
  post_id: string;
  reader: FhirRef;
  read_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
