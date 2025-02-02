import React, { useState } from 'react';
import { 
  BookOpen, Search, Star, Clock, FileText, Brain, Bot, Shield,
  Activity, TrendingUp, ChevronRight, Zap, Target, Code, Settings,
  Database, Network, Workflow, ArrowRight, BarChart2, Wallet,
  DollarSign, BarChart as ChartBar, MessageCircle, Users, Award,
  Lightbulb, Sparkles, Lock, Globe, Rocket, Cpu, LineChart, 
  AlertTriangle, Layers, Gauge, Maximize2, Minimize2, RefreshCw,
  GitBranch, GitMerge, GitPullRequest, Hexagon, Box, Command,
  Key, Menu, X, ArrowLeft, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GUIDE_CONTENT = {
  'getting-started': {
    title: 'Getting Started',
    icon: Rocket,
    color: 'text-accent-green',
    sections: {
      'Platform Overview': {
        icon: Bot,
        content: `# Neural Trading Platform Overview

Our cutting-edge platform combines advanced artificial intelligence with professional trading capabilities to deliver exceptional automated trading performance.

## Core Architecture

### Neural Network Engine
- **Multi-Layer Perceptron (MLP)** architecture
- Real-time market data processing
- Adaptive learning algorithms
- Pattern recognition capabilities
- Sentiment analysis integration

### Trading Engine
- **High-Frequency Trading (HFT)** capabilities
- Ultra-low latency execution
- Smart order routing
- Risk management integration
- Position sizing optimization

### Risk Management System
- Dynamic position sizing
- Real-time risk monitoring
- Drawdown protection
- Exposure management
- Multi-level stop-loss system

### Analytics Engine
- Real-time performance tracking
- Advanced risk metrics
- Portfolio optimization
- Custom reporting system
- Machine learning insights

## Key Features

1. **AI-Powered Trading**
   - Neural network pattern recognition
   - Real-time market analysis
   - Predictive modeling with 94.5% accuracy
   - Adaptive learning algorithms
   - Sentiment analysis integration

2. **Advanced Risk Management**
   - Dynamic position sizing
   - Multi-level stop-loss system
   - Portfolio diversification
   - Drawdown protection
   - Volatility adjustment
   - Exposure monitoring

3. **Professional Analytics**
   - Real-time performance tracking
   - Advanced risk metrics
   - Custom reporting
   - Portfolio optimization
   - Machine learning insights
   - Backtesting capabilities

4. **Security Features**
   - Military-grade encryption
   - Secure API connections
   - Multi-factor authentication
   - Real-time monitoring
   - Audit logging
   - Access control

5. **Market Analysis**
   - Technical indicators
   - Fundamental analysis
   - Sentiment analysis
   - Market correlation
   - Volume analysis
   - Price action patterns

6. **Portfolio Management**
   - Asset allocation
   - Risk-adjusted returns
   - Correlation analysis
   - Rebalancing tools
   - Performance attribution
   - Tax optimization`
      },
      'Quick Start': {
        icon: Zap,
        content: `# Quick Start Guide

## 1. Account Setup
- Create your trading account
- Configure API access
- Set initial preferences
- Verify identity
- Set security options

## 2. Platform Configuration
- Connect to MetaTrader
- Set risk parameters
- Configure notifications
- Set trading hours
- Define asset classes

## 3. Strategy Setup
- Select trading strategy
- Configure parameters
- Set risk limits
- Define timeframes
- Test configuration

## 4. First Trade
- Monitor market conditions
- Verify strategy signals
- Check risk parameters
- Execute trade
- Monitor performance

## 5. Optimization
- Analyze performance
- Adjust parameters
- Fine-tune strategy
- Optimize execution
- Monitor results`
      },
      'Security': {
        icon: Shield,
        content: `# Security Guide

## Security Architecture
- End-to-end encryption
- Secure API endpoints
- Real-time monitoring
- Audit logging
- Access control

## Authentication
- Multi-factor authentication
- Biometric verification
- Session management
- IP whitelisting
- Device verification

## Data Protection
- Encryption at rest
- Encryption in transit
- Regular backups
- Data retention
- Privacy controls

## Best Practices
- Regular password updates
- Security audit logs
- Access monitoring
- Incident response
- Security training`
      }
    }
  },
  'ai-trading': {
    title: 'AI Trading',
    icon: Brain,
    color: 'text-accent-gold',
    sections: {
      'Neural Networks': {
        icon: Network,
        content: `# Neural Network Trading System

## Advanced AI Architecture

Our system utilizes multiple neural networks:

1. **Pattern Recognition Network**
   - Market trend analysis
   - Support/resistance detection
   - Volume profile analysis
   - Price action patterns
   - Sentiment integration

2. **Prediction Network**
   - Short-term price forecasting
   - Trend direction probability
   - Volatility prediction
   - Market regime detection
   - Risk assessment

3. **Risk Assessment Network**
   - Position sizing optimization
   - Stop-loss calculation
   - Take-profit optimization
   - Risk exposure analysis
   - Portfolio optimization

4. **Execution Network**
   - Order timing optimization
   - Slippage reduction
   - Market impact analysis
   - Execution strategy
   - Cost optimization

## Network Training

1. **Data Processing**
   - Market data normalization
   - Feature engineering
   - Data cleaning
   - Outlier detection
   - Missing data handling

2. **Training Process**
   - Supervised learning
   - Reinforcement learning
   - Online learning
   - Transfer learning
   - Ensemble methods

3. **Validation**
   - Cross-validation
   - Out-of-sample testing
   - Walk-forward analysis
   - Monte Carlo simulation
   - Stress testing`
      },
      'Strategies': {
        icon: Target,
        content: `# AI Trading Strategies

## Strategy Types

1. **Trend Following**
   - AI-powered trend detection
   - Dynamic entry/exit points
   - Momentum analysis
   - Volume confirmation
   - Trend strength assessment

2. **Mean Reversion**
   - Statistical arbitrage
   - Volatility analysis
   - Support/resistance levels
   - Risk-adjusted positions
   - Mean calculation

3. **Pattern Recognition**
   - Chart pattern detection
   - Candlestick patterns
   - Volume patterns
   - Price action analysis
   - Market structure

4. **Momentum Trading**
   - Momentum indicators
   - Trend strength
   - Volume analysis
   - Price velocity
   - Acceleration patterns

5. **Arbitrage**
   - Statistical arbitrage
   - Cross-market opportunities
   - Latency arbitrage
   - Risk arbitrage
   - Correlation trading`
      },
      'Backtesting': {
        icon: Clock,
        content: `# AI Backtesting

## Features
- Historical data analysis
- Strategy optimization
- Performance metrics
- Risk assessment
- Monte Carlo simulation

## Metrics
- Win rate
- Profit factor
- Sharpe ratio
- Maximum drawdown
- Recovery factor

## Optimization
- Parameter optimization
- Walk-forward analysis
- Out-of-sample testing
- Robustness testing
- Sensitivity analysis

## Risk Analysis
- Value at Risk (VaR)
- Expected Shortfall
- Stress testing
- Scenario analysis
- Risk-adjusted returns`
      }
    }
  },
  'risk-management': {
    title: 'Risk Management',
    icon: Shield,
    color: 'text-accent-red',
    sections: {
      'Position Sizing': {
        icon: Wallet,
        content: `# Position Sizing

## Dynamic Sizing
- Account balance based
- Volatility adjusted
- Risk-based calculation
- Maximum exposure limits
- Portfolio constraints

## Implementation
\`\`\`
Position = (Balance × Risk%) ÷ Stop Loss
\`\`\`

## Risk Factors
- Market volatility
- Asset correlation
- Portfolio exposure
- Market conditions
- Trading strategy

## Optimization
- Risk allocation
- Position scaling
- Exposure management
- Risk budgeting
- Portfolio balance`
      },
      'Risk Controls': {
        icon: Shield,
        content: `# Risk Controls

## Features
- Stop loss management
- Take profit optimization
- Drawdown protection
- Exposure limits
- Volatility adjustment

## Monitoring
- Real-time risk tracking
- Alert system
- Emergency stops
- Performance metrics
- Exposure analysis

## Risk Limits
- Position limits
- Exposure limits
- Loss limits
- Drawdown limits
- Volatility limits

## Emergency Procedures
- Stop trading
- Close positions
- Risk assessment
- System review
- Recovery plan`
      }
    }
  },
  'analytics': {
    title: 'Analytics',
    icon: BarChart2,
    color: 'text-accent-green',
    sections: {
      'Performance': {
        icon: TrendingUp,
        content: `# Performance Analytics

## Metrics
- Win rate
- Profit factor
- Sharpe ratio
- Maximum drawdown
- Recovery factor

## Reporting
- Real-time dashboard
- Custom reports
- Export capabilities
- Alert system
- Performance attribution

## Analysis Tools
- Performance decomposition
- Attribution analysis
- Risk-adjusted metrics
- Benchmark comparison
- Portfolio analytics

## Optimization
- Strategy optimization
- Parameter tuning
- Portfolio optimization
- Risk optimization
- Cost optimization`
      },
      'Risk Analysis': {
        icon: Activity,
        content: `# Risk Analysis

## Features
- Value at Risk (VaR)
- Expected Shortfall
- Stress testing
- Scenario analysis
- Sensitivity analysis

## Monitoring
- Real-time tracking
- Risk alerts
- Position monitoring
- Exposure analysis
- Limit monitoring

## Risk Metrics
- Beta
- Correlation
- Volatility
- Drawdown
- Sharpe ratio

## Risk Reports
- Daily risk report
- Position report
- Exposure report
- Limit report
- Exception report`
      }
    }
  },
  'settings': {
    title: 'Settings',
    icon: Settings,
    color: 'text-accent-green',
    sections: {
      'API Configuration': {
        icon: Key,
        content: `# API Configuration

## OpenAI API Key

The OpenAI API key is required to enable advanced AI features:

1. **Enhanced Market Analysis**
   - Advanced sentiment analysis
   - Market trend predictions
   - Risk assessment
   - Trading signals

2. **AI Trading Features**
   - Neural network predictions
   - Pattern recognition
   - Market regime detection
   - Volatility forecasting

3. **Security**
   - API key is stored securely
   - Encrypted in local storage
   - Never transmitted to third parties
   - Used only for OpenAI API calls

## Configuration Steps

1. Get your API key from OpenAI:
   - Visit [OpenAI Platform](https://platform.openai.com)
   - Create an account or sign in
   - Navigate to API section
   - Generate new API key

2. Enter API Key:
   - Go to Settings page
   - Find "OpenAI API Key" section
   - Enter your API key
   - Click Save to store securely

3. Verify Configuration:
   - Check connection status
   - Test API functionality
   - Monitor usage limits
   - Track API costs

## Usage Guidelines

- Keep your API key secure
- Monitor API usage costs
- Set usage limits
- Review OpenAI pricing
- Check rate limits

## Best Practices

- Regularly rotate API keys
- Monitor API usage
- Set budget alerts
- Review security settings
- Keep backups of keys`
      }
    }
  }
};

export const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [activeSection, setActiveSection] = useState('Platform Overview');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s/, '');
        const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
        const headerClasses = level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg';
        return (
          <HeaderTag key={index} className={`${headerClasses} font-bold text-gray-100 mb-4`}>
            {text}
          </HeaderTag>
        );
      }

      if (line.startsWith('```')) {
        return null;
      }
      if (line.endsWith('```')) {
        return null;
      }
      if (line.startsWith('    ')) {
        return (
          <pre key={index} className="bg-dark p-4 rounded-lg my-4 font-mono text-sm text-gray-300 overflow-x-auto">
            {line.trim()}
          </pre>
        );
      }

      if (line.match(/^\d+\./)) {
        const text = line.replace(/^\d+\.\s/, '');
        return (
          <li key={index} className="ml-6 text-gray-300 list-decimal mb-2">
            {text}
          </li>
        );
      }
      if (line.startsWith('-')) {
        return (
          <li key={index} className="ml-6 text-gray-300 list-disc mb-2">
            {line.substring(2)}
          </li>
        );
      }

      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-bold text-accent-green mb-4">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }

      if (line.trim() === '') {
        return <br key={index} />;
      }

      return (
        <p key={index} className="text-gray-300 mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.1)_0%,transparent_100%)]" />
        <div className="cyber-grid absolute inset-0 opacity-10" />
      </div>

      {/* Back Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-green border border-accent-green rounded-lg hover:bg-accent-green/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Interactive Help Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button
            onMouseEnter={() => setShowHelpTooltip(true)}
            onMouseLeave={() => setShowHelpTooltip(false)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-green text-dark hover:bg-accent-green/90 transition-all transform hover:scale-110"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Tooltip */}
          <div className={`
            absolute bottom-full right-0 mb-2 w-64 p-3 
            bg-dark-card border border-gray-800 rounded-lg shadow-xl
            transform transition-all duration-200
            ${showHelpTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
          `}>
            <div className="text-sm text-gray-300">
              <p className="font-medium text-accent-green mb-1">Need Help?</p>
              <p className="text-xs">Browse through our comprehensive documentation or use the search bar to find specific topics.</p>
            </div>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-dark-card border-r border-b border-gray-800"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-accent-green">Documentation</h1>
            <p className="text-gray-400 mt-1">Everything you need to know about the AI Trading Platform</p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green"
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-800 rounded-lg hover:bg-dark-hover text-gray-300"
          >
            {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            {showSidebar ? 'Close Menu' : 'Show Menu'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className={`
            fixed md:relative inset-0 z-30 bg-dark md:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:col-span-3
          `}>
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-6">
                {Object.entries(GUIDE_CONTENT).map(([key, category]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <category.icon className={`w-5 h-5 ${category.color}`} />
                      <h2 className="text-lg font-semibold text-gray-100">{category.title}</h2>
                    </div>
                    <div className="space-y-1 pl-7">
                      {Object.entries(category.sections).map(([sectionKey, section]) => (
                        <button
                          key={sectionKey}
                          onClick={() => {
                            setActiveCategory(key);
                            setActiveSection(sectionKey);
                            setShowSidebar(false);
                          }}
                          className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-all group ${
                            activeCategory === key && activeSection === sectionKey
                              ? 'bg-accent-green/10 text-accent-green'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
                          }`}
                        >
                          <section.icon className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" />
                          {sectionKey}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-9">
            <div className="bg-dark-card rounded-lg p-4 md:p-8 border border-gray-800">
              {GUIDE_CONTENT[activeCategory]?.sections[activeSection]?.content && (
                <div className="prose prose-invert max-w-none">
                  {renderContent(GUIDE_CONTENT[activeCategory].sections[activeSection].content)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};