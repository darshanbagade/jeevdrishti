import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { env } from '@/config/env';
import type { AuthSession, AuthUser, UserRole } from '@/types/auth';

const SESSION_KEY = 'jeevdrishti.session';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  signIn: (
    username: string,
    password: string,
    requestedRole?: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

function isRole(value: unknown): value is UserRole {
  return value === 'field' || value === 'reviewer' || value === 'admin';
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) return false;

  const session = value as Record<string, unknown>;
  const user = session.user;

  if (typeof user !== 'object' || user === null) return false;

  const candidate = user as Record<string, unknown>;

  return (
    typeof session.token === 'string' &&
    session.token.length > 0 &&
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    isRole(candidate.role)
  );
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  isLoading: false,
  error: null,

  hydrate: async () => {
    try {
      const saved = await SecureStore.getItemAsync(SESSION_KEY);

      if (!saved) {
        set({ token: null, user: null });
        return;
      }

      const parsed: unknown = JSON.parse(saved);

      if (!isAuthSession(parsed)) {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        set({ token: null, user: null });
        return;
      }

      set({ token: parsed.token, user: parsed.user, error: null });
    } catch {
      set({
        token: null,
        user: null,
        error: 'Unable to restore the saved session.',
      });
    } finally {
      set({ isHydrated: true });
    }
  },

  signIn: async (username, password, requestedRole = 'field') => {
    set({ isLoading: true, error: null });

    try {
      const name = username.trim();

      if (!name || !password) {
        throw new Error('Enter your username and password.');
      }

      if (!env.useMock) {
        throw new Error(
          'Backend authentication is not connected yet.',
        );
      }

      // Development mock only; this is not real authentication.
      const role: UserRole = env.demo ? requestedRole : 'field';
      const session: AuthSession = {
        token: `demo:${encodeURIComponent(name.toLowerCase())}`,
        user: {
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          role,
        },
      };

      await SecureStore.setItemAsync(
        SESSION_KEY,
        JSON.stringify(session),
      );

      set({
        token: session.token,
        user: session.user,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed.';

      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ token: null, user: null, error: null });

    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch {
      const message = 'Could not clear the saved session from this device.';
      set({ error: message });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),
}));
