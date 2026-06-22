import axios from 'axios';
import { apiClient } from '@/api/client';
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  reactivateStudent,
  signupStudent,
} from '@/services/students.service';

jest.mock('@/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  API_BASE_URL: 'http://test',
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;
const mockAxiosPost = (axios as any).post as jest.Mock;

const fakeStudent = {
  id: 'Student/xyz',
  name: 'Pedro Costa',
  email: null,
  birth_date: null,
  pronouns: null,
  biography: null,
  status: 'ATIVO',
  course: null,
  user: null,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
};

describe('students.service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('listStudents', () => {
    it('passa page/limit/name/status corretamente', async () => {
      mockGet.mockResolvedValueOnce({
        data: { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } },
      });
      await listStudents({ name: 'pedro', status: 'INATIVO', page: 2 });
      expect(mockGet).toHaveBeenCalledWith(
        '/students',
        expect.objectContaining({
          params: expect.objectContaining({ name: 'pedro', status: 'INATIVO', page: 2 }),
        })
      );
    });
  });

  describe('getStudentById', () => {
    it('concatena FhirRef direto', async () => {
      mockGet.mockResolvedValueOnce({ data: fakeStudent });
      await getStudentById('Student/xyz');
      expect(mockGet).toHaveBeenCalledWith('/students/Student/xyz');
    });
  });

  describe('createStudent', () => {
    it('POST /students com payload + omite undefined', async () => {
      mockPost.mockResolvedValueOnce({ data: fakeStudent });
      await createStudent({ name: 'Pedro' });
      const body = mockPost.mock.calls[0]![1];
      expect(body).toEqual({ name: 'Pedro' });
    });
  });

  describe('updateStudent / deleteStudent / reactivateStudent', () => {
    it('updateStudent — PATCH com body parcial', async () => {
      mockPatch.mockResolvedValueOnce({ data: fakeStudent });
      await updateStudent('Student/xyz', { name: 'Pedrinho' });
      expect(mockPatch).toHaveBeenCalledWith('/students/Student/xyz', { name: 'Pedrinho' });
    });

    it('deleteStudent — DELETE soft', async () => {
      mockDelete.mockResolvedValueOnce({ status: 204 });
      await expect(deleteStudent('Student/xyz')).resolves.toBeUndefined();
    });

    it('reactivateStudent — PATCH status=ATIVO', async () => {
      mockPatch.mockResolvedValueOnce({ data: { ...fakeStudent, status: 'ATIVO' } });
      await reactivateStudent('Student/xyz');
      expect(mockPatch).toHaveBeenCalledWith(
        '/students/Student/xyz',
        { status: 'ATIVO' }
      );
    });
  });

  describe('signupStudent', () => {
    it('usa axios cru (não apiClient) sem Authorization', async () => {
      mockAxiosPost.mockResolvedValueOnce({ data: fakeStudent });
      await signupStudent({
        name: 'Novo Aluno',
        user: { login: 'novo', password: '12345678' },
      });
      expect(mockAxiosPost).toHaveBeenCalledWith(
        'http://test/students',
        expect.objectContaining({
          name: 'Novo Aluno',
          user: { login: 'novo', password: '12345678' },
        })
      );
      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
