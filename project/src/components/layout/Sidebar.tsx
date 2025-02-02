import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  Brain, 
  History,
  BookOpen,
  Search,
  ChevronDown,
  Briefcase,
  Bot,
  AlertCircle,
  Trophy,
  Target,
  Zap,
  Users,
  Gift,
  Clock,
  Award,
  Cog,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { 
    name: 'Trading Hub',
    href: '/',
    icon: LayoutDashboard,
    description: 'Real-time market overview'
  },
  {
    name: 'AI Trading',
    icon: Brain,
    subitems: [
      { 
        name: 'Strategies',
        href: '/strategies',
        icon: LineChart,
        description: 'Manage trading strategies'
      },
      { 
        name: 'Backtesting',
        href: '/backtesting',
        icon: History,
        description: 'Test against historical data'
      },
      { 
        name: 'AI Analysis',
        href: '/ai-analysis',
        icon: Bot,
        description: 'Advanced market analysis'
      },
      {
        name: 'AI Challenge',
        href: '/ai-challenge',
        icon: Trophy,
        description: 'Compete in prop firm challenges',
        badge: 'New'
      }
    ]
  },
  {
    name: 'Portfolio',
    icon: Briefcase,
    subitems: [
      {
        name: 'Performance',
        href: '/performance',
        icon: LineChart,
        description: 'Track performance metrics'
      },
      {
        name: 'Risk Analysis',
        href: '/risk',
        icon: AlertCircle,
        description: 'Monitor trading risks'
      }
    ]
  },
  {
    name: 'Referrals',
    icon: Users,
    subitems: [
      {
        name: 'Referral Dashboard',
        href: '/referrals/dashboard',
        icon: LayoutDashboard,
        description: 'Overview of your referral performance',
        badge: 'New'
      },
      {
        name: 'Invite Friends',
        href: '/referrals/invite',
        icon: Gift,
        description: 'Share your referral link'
      },
      {
        name: 'Referral History',
        href: '/referrals/history',
        icon: Clock,
        description: 'Track your referral activities'
      },
      {
        name: 'Rewards Center',
        href: '/referrals/rewards',
        icon: Award,
        description: 'View and redeem your rewards'
      },
      {
        name: 'Referral Settings',
        href: '/referrals/settings',
        icon: Cog,
        description: 'Configure referral preferences'
      }
    ]
  },
  { 
    name: 'Documentation',
    href: '/docs',
    icon: BookOpen,
    description: 'Platform documentation'
  },
  { 
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configure platform'
  }
];

export const Sidebar = ({ onClose }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['AI Trading', 'Referrals']); // Default expanded
  const location = useLocation();

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const filteredNavigation = navigation.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const hasMatchingSubitems = item.subitems?.some(
      subitem => subitem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesSearch || hasMatchingSubitems;
  });

  const renderNavItem = (item: any, isSubItem = false) => {
    const isActive = location.pathname === item.href;
    const baseClasses = `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative
      ${isSubItem ? 'ml-6' : ''}
      ${isActive
        ? 'bg-accent-green/10 text-accent-green shadow-[0_0_10px_rgba(74,222,128,0.1)]'
        : 'text-gray-400 hover:bg-dark-hover hover:text-gray-200'
      }`;

    if (item.href) {
      return (
        <Link
          key={item.name}
          to={item.href}
          className={baseClasses}
          title={item.description}
          onClick={onClose}
        >
          <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-accent-green' : ''}`} />
          <span>{item.name}</span>
          {item.badge && (
            <span className="ml-2 px-1.5 py-0.5 text-2xs font-medium bg-accent-gold/10 text-accent-gold rounded-full">
              {item.badge}
            </span>
          )}
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-3 py-1 bg-dark-card rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            {item.description}
          </div>
        </Link>
      );
    }

    return (
      <div key={item.name}>
        <button
          onClick={() => toggleMenu(item.name)}
          className={`w-full ${baseClasses}`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          <span>{item.name}</span>
          <ChevronDown 
            className={`ml-auto w-4 h-4 transition-transform ${
              expandedMenus.includes(item.name) ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedMenus.includes(item.name) && item.subitems?.map((subitem: any) => 
          renderNavItem(subitem, true)
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-dark-card/50 backdrop-blur-sm border-r border-gray-800">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search navigation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-dark border border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 px-4 py-2 overflow-y-auto">
        {filteredNavigation.map(item => renderNavItem(item))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="rounded-lg bg-dark p-4">
          <p className="text-xs text-gray-400 mb-2">System Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
            <span className="text-sm text-gray-300">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};