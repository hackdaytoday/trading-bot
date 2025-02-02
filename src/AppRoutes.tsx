import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { Login } from './components/auth/Login';
import { Layout } from './components/layout/Layout';
import Dashboard from './components/trading/Dashboard';
import { Strategies } from './components/trading/Strategies';
import { Backtesting } from './components/trading/Backtesting';
import { AIAnalysis } from './components/trading/AIAnalysis';
import { AIChallenge } from './components/trading/AIChallenge';
import { Performance } from './components/portfolio/Performance';
import { RiskAnalysis } from './components/portfolio/RiskAnalysis';
import { Documentation } from './components/docs/Documentation';
import { LearnMore } from './components/docs/LearnMore';
import { Settings } from './components/trading/Settings';
import { ReferralDashboard } from './components/referrals/ReferralDashboard';
import { InviteFriends } from './components/referrals/InviteFriends';
import { ReferralHistory } from './components/referrals/ReferralHistory';
import { RewardsCenter } from './components/referrals/RewardsCenter';
import { ReferralSettings } from './components/referrals/ReferralSettings';
import { useAuth } from './contexts/AuthContext';

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-green/20 border-t-accent-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - no auth required */}
      <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/learn-more" element={<LearnMore />} />
      <Route path="/docs" element={<Documentation />} />

      {/* Protected routes - require auth */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="strategies" element={<Strategies />} />
        <Route path="backtesting" element={<Backtesting />} />
        <Route path="ai-analysis" element={<AIAnalysis />} />
        <Route path="ai-challenge" element={<AIChallenge />} />
        <Route path="performance" element={<Performance />} />
        <Route path="risk" element={<RiskAnalysis />} />
        
        {/* Referral System Routes */}
        <Route path="referrals">
          <Route path="dashboard" element={<ReferralDashboard />} />
          <Route path="invite" element={<InviteFriends />} />
          <Route path="history" element={<ReferralHistory />} />
          <Route path="rewards" element={<RewardsCenter />} />
          <Route path="settings" element={<ReferralSettings />} />
        </Route>

        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};