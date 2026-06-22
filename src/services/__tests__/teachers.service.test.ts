import { apiClient } from '@/api/client';
import {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  reactivateTeacher,
} from '@/services/teachers.service';

jest.mock('@/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

const fakeTeacher = {
  id: 'Teacher/abc',
  name: 'João Silva',
  email: 'joao@x.com',
  birth_date: '1990-05-15',
  pronouns: 'ele/dele',
  biography: null,
  status: 'ATIVO',
  disciplines: [],
  user: null,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

const fakePage = (rows: any[]) => ({
  data: rows,
  pagination: { page: 1, limit: 20, total: rows.length, totalPages: 1 },
});

describe('teachers.service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('listTeachers', () => {
    it('passa page/limit defaults', async () => {
      mockGet.mockResolvedValueOnce({ data: fakePage([fakeTeacher]) });
      await listTeachers();
      expect(mockGet).toHaveBeenCalledWith(
        '/teachers',
        expect.objectContaining({ params: expect.objectContaining({ page: 1, limit: 20 }) })
      );
    });

    it('passa name e status quando fornecidos', async () => {
      mockGet.mockResolvedValueOnce({ data: fakePage([]) });
      await listTeachers({ name: 'joão', status: 'ATIVO' });
      expect(mockGet).toHaveBeenCalledWith(
        '/teachers',
        expect.objectContaining({ params: expect.objectContaining({ name: 'joão', status: 'ATIVO' }) })
      );
    });

    it('omite name/status quando undefined', async () => {
      mockGet.mockResolvedValueOnce({ data: fakePage([]) });
      await listTeachers({ page: 2 });
      const call = mockGet.mock.calls[0]!;
      expect(call[1].params).not.toHaveProperty('name');
      expect(call[1].params).not.toHaveProperty('status');
    });
  });

  describe('getTeacherById', () => {
    it('concatena FhirRef direto na URL sem encodeURIComponent', async () => {
      mockGet.mockResolvedValueOnce({ data: fakeTeacher });
      await getTeacherById('Teacher/abc');
      expect(mockGet).toHaveBeenCalledWith('/teachers/Teacher/abc');
    });
  });

  describe('createTeacher', () => {
    it('POST /teachers com payload completo', async () => {
      mockPost.mockResolvedValueOnce({ data: fakeTeacher });
      await createTeacher({
        name: 'João',
        email: 'j@x.com',
        discipline_ids: ['d1'],
      });
      expect(mockPost).toHaveBeenCalledWith('/teachers', expect.objectContaining({
        name: 'João',
        email: 'j@x.com',
        discipline_ids: ['d1'],
      }));
    });

    it('omite campos undefined do payload', async () => {
      mockPost.mockResolvedValueOnce({ data: fakeTeacher });
      await createTeacher({ name: 'João', discipline_ids: [] });
      const body = mockPost.mock.calls[0]![1];
      expect(body).toEqual({ name: 'João', discipline_ids: [] });
    });

    it('inclui bloco user quando fornecido', async () => {
      mockPost.mockResolvedValueOnce({ data: fakeTeacher });
      await createTeacher({
        name: 'João',
        discipline_ids: [],
        user: { login: 'joao', password: '12345678' },
      });
      const body = mockPost.mock.calls[0]![1];
      expect(body.user).toEqual({ login: 'joao', password: '12345678' });
    });
  });

  describe('updateTeacher', () => {
    it('PATCH /teachers/:id com payload parcial', async () => {
      mockPatch.mockResolvedValueOnce({ data: fakeTeacher });
      await updateTeacher('Teacher/abc', { name: 'João Atualizado' });
      expect(mockPatch).toHaveBeenCalledWith(
        '/teachers/Teacher/abc',
        { name: 'João Atualizado' }
      );
    });
  });

  describe('deleteTeacher', () => {
    it('DELETE /teachers/:id (soft delete)', async () => {
      mockDelete.mockResolvedValueOnce({ status: 204 });
      await expect(deleteTeacher('Teacher/abc')).resolves.toBeUndefined();
      expect(mockDelete).toHaveBeenCalledWith('/teachers/Teacher/abc');
    });
  });

  describe('reactivateTeacher', () => {
    it('PATCH com status=ATIVO', async () => {
      mockPatch.mockResolvedValueOnce({ data: { ...fakeTeacher, status: 'ATIVO' } });
      const r = await reactivateTeacher('Teacher/abc');
      expect(mockPatch).toHaveBeenCalledWith(
        '/teachers/Teacher/abc',
        { status: 'ATIVO' }
      );
      expect(r.status).toBe('ATIVO');
    });
  });
});
