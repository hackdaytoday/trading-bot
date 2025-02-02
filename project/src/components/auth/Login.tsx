import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wifi, Lock, User, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [server, setServer] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { connectMetaTrader, isLoading, error, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form...', { server, login });
    try {
      await connectMetaTrader(server, login, password);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-6">
      <div className="w-full max-w-md">
        <div className="bg-dark-card rounded-lg p-8 card card-3d neon-border">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-2">MetaTrader Login</h2>
            <p className="text-gray-400">Sign in to your MetaTrader account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
            {/* Server Field */}
            <div>
              <label htmlFor="server" className="block text-sm font-medium text-gray-300 mb-2">
                MT5 Server Name
              </label>
              <div className="relative">
                <input
                  id="server"
                  type="text"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors relative z-10"
                  placeholder="Enter your MT5 server name"
                  required
                  disabled={isLoading}
                />
                <Wifi className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Login Field */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-2">
                MetaTrader 5 Login
              </label>
              <div className="relative">
                <input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors relative z-10"
                  placeholder="Enter your MT5 login number"
                  required
                  disabled={isLoading}
                />
                <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors relative z-10"
                  placeholder="Enter your MT5 password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-400 transition-colors z-20"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-accent-green text-dark font-medium rounded-lg px-4 py-2.5 hover:bg-accent-green/90 focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !server || !login || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect to MetaTrader 5'
              )}
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-400">
              Having trouble connecting?{' '}
              <a href="#" className="text-accent-green hover:text-accent-green/80 transition-colors">
                Get help
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};