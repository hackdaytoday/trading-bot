import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './components/dashboard/Dashboard';
import Strategies from './pages/Strategies';
import Performance from './pages/Performance';
import Settings from './pages/Settings';

// Layout
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="strategies" element={<Strategies />} />
            <Route path="performance" element={<Performance />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
