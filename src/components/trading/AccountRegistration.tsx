import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AccountRegistration() {
  const { connectMetaTrader, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    server: '',
    login: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.server || !formData.login || !formData.password) {
        toast.error('Wypełnij wszystkie pola');
        return;
      }

      await connectMetaTrader(
        formData.server,
        formData.login,
        formData.password
      );
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      toast.error('Błąd podczas rejestracji konta');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Połącz konto MetaTrader</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Serwer MT4
          </label>
          <input
            type="text"
            name="server"
            value={formData.server}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="np. ICMarketsSC-Demo"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Login
          </label>
          <input
            type="text"
            name="login"
            value={formData.login}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Twój login MT4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hasło
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Twoje hasło MT4"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Łączenie...' : 'Połącz konto'}
        </button>
      </form>
    </div>
  );
}
