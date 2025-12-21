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

export function PAAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifySession();
  }, []);

  async function verifySession() {
    try {
      const session = await api.getSession();
      if (session.authenticated) {
        setUsername(session.username);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Session verification failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function setup(username: string, password: string) {
    const result = await api.setup(username, password);
    setUsername(result.username);
    setIsAuthenticated(true);
    // Clear saved tab on first setup to ensure we start at configs
    localStorage.removeItem('currentTab');
  }

  async function login(username: string, password: string) {
    const result = await api.login(username, password);
    setUsername(result.username);
    setIsAuthenticated(true);
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
