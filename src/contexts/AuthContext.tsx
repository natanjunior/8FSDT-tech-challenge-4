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

  const login = useCallback(async (payload: LoginRequest) => {
    setIsAuthenticating(true);
    try {
      const { user: nextUser, profile: nextProfile } = await loginService(payload);
      setUser(nextUser);
      setProfile(nextProfile);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isHydrating,
      isAuthenticating,
      login,
      logout,
    }),
    [user, profile, isHydrating, isAuthenticating, login, logout]
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
