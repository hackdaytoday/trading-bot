import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import toast from 'react-hot-toast';

// Global error handlers
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  const error = event.reason;
  console.error('Unhandled promise rejection:', error);
  
  let message = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null) {
    message = error.message || JSON.stringify(error);
  } else if (typeof error === 'string') {
    message = error;
  }

  // Clean up error message
  message = message
    .replace(/\. Request URL:.*$/, '')
    .replace(/Error: /, '');

  // Make messages more user-friendly
  if (message.includes('not synchronized')) {
    message = 'Please wait for connection to synchronize';
  } else if (message.includes('timeout')) {
    message = 'Connection timed out - please try again';
  } else if (message.includes('invalid credentials')) {
    message = 'Invalid login or password';
  } else if (message.includes('not initialized')) {
    message = 'Connection service not ready - please refresh the page';
  }
  
  // Filter out non-critical errors
  if (message.includes('vite.svg') || 
      message.includes('favicon.ico') ||
      message.includes('Failed to fetch') ||
      message.includes('Network request failed')) {
    console.warn('Non-critical resource error:', message);
    return;
  }
  
  toast.error(message);
});

window.addEventListener('error', (event) => {
  if (event.error === null && event.message.includes('Loading')) {
    return;
  }
  
  event.preventDefault();
  console.error('Global error:', event.error);
  
  if (event.error) {
    const message = event.error.message || 'An unexpected error occurred';
    toast.error(message);
  }
});

// Initialize app with error handling
try {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('App initialization error:', error);
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0b0e;
      color: #e5e7eb;
      padding: 1rem;
      text-align: center;
    ">
      <div>
        <h1 style="color: #ef4444; font-size: 1.5rem; margin-bottom: 1rem;">
          Failed to start application
        </h1>
        <p style="color: #9ca3af; margin-bottom: 1rem;">
          Please try refreshing the page. If the problem persists, contact support.
        </p>
        <button 
          onclick="window.location.reload()"
          style="
            background: #4ade80;
            color: #0a0b0e;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
          "
        >
          Refresh Page
        </button>
      </div>
    </div>
  `;
}