import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { metaApiService } from '../services/metaapi';
import { MetaTraderAccount } from '../types/metaTrader';

interface User {
  metaTrader: {
    server: string;
    login: string;
    connected: boolean;
    account?: MetaTraderAccount;
  }
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connectMetaTrader: (server: string, login: string, password: string) => Promise<void>;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      navigate('/dashboard');
      toast.success('Successfully connected to MetaTrader!');
    } catch (error: any) {
      setError(error.message);
      setUser(null);
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    setError(null);
    navigate('/login');
    toast.info('Disconnected from MetaTrader');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    connectMetaTrader,
    disconnect
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
