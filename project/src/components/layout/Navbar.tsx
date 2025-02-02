import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaChartLine,
  FaCog,
  FaHistory,
  FaRobot,
  FaSignOutAlt,
  FaTachometerAlt,
  FaFlask,
} from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, disconnect } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: FaTachometerAlt,
    },
    {
      name: 'Strategies',
      href: '/app/strategies',
      icon: FaRobot,
    },
    {
      name: 'Testing',
      href: '/app/testing',
      icon: FaFlask,
    },
    {
      name: 'Performance',
      href: '/app/performance',
      icon: FaChartLine,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Trading Bot"
              />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <Link
              to="/app/settings"
              className={`${
                isActive('/app/settings')
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              } p-2 rounded-md text-sm font-medium`}
            >
              <FaCog className="h-5 w-5" />
            </Link>
            <button
              onClick={disconnect}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 rounded-md text-sm font-medium"
            >
              <FaSignOutAlt className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </div>
            </Link>
          ))}
          <Link
            to="/app/settings"
            className={`${
              isActive('/app/settings')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            <div className="flex items-center">
              <FaCog className="mr-3 h-4 w-4" />
              Settings
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
