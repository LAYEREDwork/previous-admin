import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  logout: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  setup: (username: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifySession();
  }, []);

  async function verifySession() {
    console.log('[Auth] Context: Verifying session...');
    try {
      const session = await api.getSession();
      if (session.authenticated) {
        console.log('[Auth] Context: Session verified, user:', session.username);
        setUsername(session.username);
        setIsAuthenticated(true);
      } else {
        console.log('[Auth] Context: Session not authenticated');
      }
    } catch (error) {
      console.error('[Auth] Context: Session verification failed:', error);
    } finally {
      setLoading(false);
      console.log('[Auth] Context: Session verification completed');
    }
  }

  async function setup(username: string, password: string) {
    console.log('[Auth] Context: Starting setup for user:', username);
    const result = await api.setup(username, password);
    console.log('[Auth] Context: Setup completed, result:', result);
    setUsername(result.username);
    setIsAuthenticated(true);
    // Clear saved tab on first setup to ensure we start at configs
    localStorage.removeItem('currentTab');
    console.log('[Auth] Context: Setup process finished');
  }

  async function login(username: string, password: string) {
    console.log('[Auth] Context: Starting login for user:', username);
    const result = await api.login(username, password);
    console.log('[Auth] Context: Login completed, result:', result);
    setUsername(result.username);
    setIsAuthenticated(true);
    console.log('[Auth] Context: Login process finished');
  }

  async function logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUsername(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, setup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
