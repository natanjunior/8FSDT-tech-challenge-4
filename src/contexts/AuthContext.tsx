import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  login as loginService,
  logout as logoutService,
} from '@/services/auth.service';
import {
  getSecureItem,
  SECURE_KEYS,
} from '@/services/secure-storage.service';
import type { LoginRequest, User } from '@/types/api';

function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isAuthenticating: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN);
      const rawUser = await getSecureItem(SECURE_KEYS.AUTH_USER);
      const parsed = parseStoredUser(rawUser);
      if (!cancelled) {
        if (token && parsed) {
          setUser(parsed);
        }
        setIsHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsAuthenticating(true);
    try {
      const { user: nextUser } = await loginService(payload);
      setUser(nextUser);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isHydrating,
      isAuthenticating,
      login,
      logout,
    }),
    [user, isHydrating, isAuthenticating, login, logout]
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
