import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Wifi, WifiOff, Menu, ChevronDown, Users, Wallet, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, disconnect, updateAccountInfo } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Add real-time balance updates
  useEffect(() => {
    let updateInterval: NodeJS.Timer;

    const startUpdates = () => {
      if (user?.metaTrader.connected && updateAccountInfo) {
        // Initial update
        updateAccountInfo().catch(console.error);

        // Set up periodic updates
        updateInterval = setInterval(() => {
          updateAccountInfo().catch(console.error);
        }, 1000);
      }
    };

    startUpdates();

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [user?.metaTrader.connected, updateAccountInfo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <nav className="sticky top-0 bg-dark-card/95 backdrop-blur-md border-b border-gray-800 z-40">
      <div className="px-3 xs:px-4 sm:px-5 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-3 xs:gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-accent-green/20 rounded-lg active-state"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/5 flex items-center justify-center shadow-glow">
                <Wifi className="w-4 h-4 xs:w-5 xs:h-5 text-accent-green" />
              </div>
              <div>
                <h1 className="text-base xs:text-lg sm:text-xl font-bold text-gray-100">STH BOT</h1>
                <p className="text-2xs text-gray-500 hidden xs:block">AI Trading Platform</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4">
            {/* Account Stats - Desktop */}
            {user?.metaTrader.connected && user?.metaTrader.account && (
              <div className="hidden md:grid grid-cols-4 gap-2">
                {/* Balance */}
                <div className="px-4 py-2 rounded-lg bg-dark-card border border-gray-800/50 shadow-soft">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Wallet className="w-4 h-4 text-accent-green" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Balance</span>
                      <span className="text-sm font-medium text-accent-green">
                        {formatCurrency(user.metaTrader.account.balance)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Equity */}
                <div className="px-4 py-2 rounded-lg bg-dark-card border border-gray-800/50 shadow-soft">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-accent-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Equity</span>
                      <span className="text-sm font-medium text-accent-gold">
                        {formatCurrency(user.metaTrader.account.equity)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Margin */}
                <div className="px-4 py-2 rounded-lg bg-dark-card border border-gray-800/50 shadow-soft">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <TrendingUp className="w-4 h-4 text-accent-green" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Free Margin</span>
                      <span className="text-sm font-medium text-accent-green">
                        {formatCurrency(user.metaTrader.account.freeMargin)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* P/L */}
                <div className="px-4 py-2 rounded-lg bg-dark-card border border-gray-800/50 shadow-soft">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <TrendingUp className={`w-4 h-4 ${user.metaTrader.account.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">P/L</span>
                      <span className={`text-sm font-medium ${user.metaTrader.account.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {formatCurrency(user.metaTrader.account.profit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-card border border-gray-800/50 shadow-soft">
              {user?.metaTrader.connected ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Wifi className="w-4 h-4 text-accent-green" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                    </div>
                    <span className="text-gray-100 text-sm">
                      Connected to <span className="text-accent-green font-medium">{user.metaTrader.server}</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-accent-red" />
                  <span className="text-gray-400 text-sm">Disconnected</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-0.5 xs:gap-1">
              <button 
                className="relative p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-dark active-state"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-gold rounded-full" />
              </button>

              <button 
                className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-dark active-state"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* User Menu */}
            <div className="relative pl-2 xs:pl-3 border-l border-gray-800" ref={menuRef}>
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-100">{user?.metaTrader.login}</p>
                  <p className="text-2xs text-gray-500">Trading Account</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="px-3 xs:px-4 py-2 text-sm font-medium text-gray-200 bg-dark hover:bg-dark-hover rounded-lg transition-all border border-gray-800 hover:border-gray-700 hover:shadow-lg active-state group whitespace-nowrap"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <span className="hidden xs:inline">Account</span>
                    <span className="xs:hidden">Menu</span>
                    <ChevronDown className={`w-4 h-4 ml-1.5 xs:ml-2 inline-block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-dark-card rounded-lg shadow-elevated border border-gray-800">
                      <div className="px-4 py-2 border-b border-gray-800 sm:hidden">
                        <p className="text-sm font-medium text-gray-100">{user?.metaTrader.login}</p>
                        <p className="text-2xs text-gray-500">Trading Account</p>
                      </div>
                      {/* Mobile Account Stats */}
                      {user?.metaTrader.connected && user?.metaTrader.account && (
                        <div className="px-4 py-2 border-b border-gray-800 md:hidden">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-400">Balance</p>
                              <p className="text-sm font-medium text-accent-green">
                                {formatCurrency(user.metaTrader.account.balance)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Equity</p>
                              <p className="text-sm font-medium text-accent-gold">
                                {formatCurrency(user.metaTrader.account.equity)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Free Margin</p>
                              <p className="text-sm font-medium text-accent-green">
                                {formatCurrency(user.metaTrader.account.freeMargin)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">P/L</p>
                              <p className={`text-sm font-medium ${user.metaTrader.account.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                                {formatCurrency(user.metaTrader.account.profit)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          disconnect();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-dark-hover transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};