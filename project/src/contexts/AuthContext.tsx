import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { metaApiService } from '../services/metaapi';
import toast from 'react-hot-toast';

interface MetaTraderAccount {
  balance: number;
  equity: number;
  profit: number;
}

interface User {
  metaTrader: {
    server: string;
    login: string;
    connected: boolean;
    account?: MetaTraderAccount;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connectMetaTrader: (server: string, login: string, password: string) => Promise<void>;
  disconnect: () => Promise<void>;
  updateAccountInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateAccountInfo = useCallback(async () => {
    if (!user?.metaTrader.connected) return;

    try {
      const accountInfo = await metaApiService.getAccountInfo();
      setUser(prev => prev ? {
        ...prev,
        metaTrader: {
          ...prev.metaTrader,
          account: accountInfo
        }
      } : null);
    } catch (error) {
      console.error('Błąd podczas aktualizacji informacji o koncie:', error);
      // Jeśli nie możemy pobrać informacji, zakładamy że połączenie zostało przerwane
      setUser(null);
    }
  }, [user]);

  const connectMetaTrader = async (server: string, login: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const accountInfo = await metaApiService.connect(server, login, password);
      
      setUser({
        metaTrader: {
          server,
          login,
          connected: true,
          account: accountInfo
        }
      });

      toast.success('Połączono z kontem MetaTrader');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Błąd podczas łączenia z kontem MetaTrader:', error);
      setError(error.message || 'Nie udało się połączyć z kontem MetaTrader');
      toast.error(error.message || 'Nie udało się połączyć z kontem MetaTrader');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await metaApiService.disconnect();
      setUser(null);
      toast.success('Rozłączono z kontem MetaTrader');
    } catch (error) {
      console.error('Błąd podczas rozłączania:', error);
      toast.error('Wystąpił błąd podczas rozłączania');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        connectMetaTrader,
        disconnect,
        updateAccountInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}