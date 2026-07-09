import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Toast from 'react-native-toast-message';
import { setUnauthorizedHandler } from '@/api/client';
import {
  login as loginService,
  logout as logoutService,
  clearSession,
} from '@/services/auth.service';
import { getMyTeacher } from '@/services/teachers.service';
import { getMyStudent } from '@/services/students.service';
import {
  getSecureItem,
  setSecureItem,
  SECURE_KEYS,
} from '@/services/secure-storage.service';
import type { LoginRequest, Profile, User } from '@/types/api';

function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function parseStoredProfile(raw: string | null): Profile {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export interface AuthContextValue {
  user: User | null;
  profile: Profile;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isAuthenticating: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Evita N toasts/limpezas quando várias requests autenticadas 401 quase juntas.
  // Rearmado no login bem-sucedido.
  const isClearingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN);
      const rawUser = await getSecureItem(SECURE_KEYS.AUTH_USER);
      const rawProfile = await getSecureItem(SECURE_KEYS.AUTH_PROFILE);
      const parsedUser = parseStoredUser(rawUser);
      const parsedProfile = parseStoredProfile(rawProfile);
      if (!cancelled) {
        if (token && parsedUser) {
          setUser(parsedUser);
          setProfile(parsedProfile);
        }
        setIsHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Ponte com o response interceptor do apiClient: numa 401 de sessão (request que
  // carregava Bearer), limpa a sessão local SEM rede e zera o estado. Sem navegação —
  // as telas protegidas caem para Home pelos guards (useRequireRole / isAuthenticated).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (isClearingRef.current) return;
      isClearingRef.current = true;
      void (async () => {
        await clearSession();
        setUser(null);
        setProfile(null);
        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Faça login novamente.',
        });
      })();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsAuthenticating(true);
    try {
      const { user: nextUser, profile: nextProfile } = await loginService(payload);
      setUser(nextUser);
      setProfile(nextProfile);
      isClearingRef.current = false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const next =
      user.role === 'TEACHER'
        ? await getMyTeacher()
        : await getMyStudent();
    setProfile(next);
    await setSecureItem(SECURE_KEYS.AUTH_PROFILE, JSON.stringify(next));
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isHydrating,
      isAuthenticating,
      login,
      logout,
      refreshProfile,
    }),
    [user, profile, isHydrating, isAuthenticating, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
