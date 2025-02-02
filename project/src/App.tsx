import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import StrategyManager from './components/strategy/StrategyManager';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <StrategyManager />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1d23',
              color: '#e5e7eb',
              border: '1px solid #374151'
            }
          }} 
        />
      </AuthProvider>
    </Router>
  );
}

export default App;