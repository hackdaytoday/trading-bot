import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Strategies from './pages/Strategies';
import Performance from './pages/Performance';

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
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/strategies" element={<Strategies />} />
            <Route path="/performance" element={<Performance />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
