import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, disconnect } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/dashboard"
              className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
            >
              Trading Bot
            </Link>
          </div>
          <div className="flex items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {user.metaTrader.server} - {user.metaTrader.login}
                </span>
                <button
                  onClick={disconnect}
                  className="px-3 py-2 rounded text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
