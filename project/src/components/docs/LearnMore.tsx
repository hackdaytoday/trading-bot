import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, ChevronRight, Bot, Shield, Activity, TrendingUp,
  ArrowLeft, Cpu, LineChart, Lock, Zap, Globe, Target, 
  Layers, Rocket, Code, Database, Network, Workflow, 
  ArrowRight, BarChart2, Wallet, DollarSign, BarChart as ChartBar,
  MessageCircle, Users, Award, Lightbulb, Sparkles, BookOpen,
  Settings
} from 'lucide-react';

export const LearnMore: React.FC = () => {
  const [activeSection] = useState(0);

  const features = [
    {
      title: 'Neural Network Analysis',
      icon: Brain,
      description: 'Our advanced AI processes millions of data points in real-time, identifying patterns invisible to human traders.',
      benefits: [
        'Pattern recognition across multiple timeframes',
        'Sentiment analysis of market movements',
        'Predictive modeling with 94.5% accuracy',
        'Adaptive learning from market conditions'
      ]
    },
    {
      title: 'Quantum Processing',
      icon: Cpu,
      description: 'State-of-the-art processing capabilities deliver lightning-fast analysis and execution.',
      benefits: [
        'Microsecond decision making',
        'Multi-dimensional data analysis',
        'Real-time market adaptation',
        'Parallel strategy execution'
      ]
    },
    {
      title: 'Advanced Risk Management',
      icon: Shield,
      description: 'Sophisticated risk control systems protect your capital with military-grade precision.',
      benefits: [
        'Dynamic position sizing',
        'Automated stop-loss management',
        'Portfolio diversification',
        'Drawdown protection'
      ]
    },
    {
      title: 'Smart Portfolio Optimization',
      icon: Wallet,
      description: 'AI-driven portfolio management ensures optimal asset allocation and risk-adjusted returns.',
      benefits: [
        'Automated rebalancing',
        'Correlation analysis',
        'Risk-adjusted position sizing',
        'Market regime detection'
      ]
    }
  ];

  const userBenefits = {
    novice: [
      {
        title: 'Guided Trading Experience',
        icon: Lightbulb,
        description: 'Perfect for beginners with no prior trading experience'
      },
      {
        title: 'Educational Resources',
        icon: BookOpen,
        description: 'Comprehensive learning materials and tutorials'
      },
      {
        title: 'Risk Protection',
        icon: Shield,
        description: 'Built-in safeguards to protect your capital'
      },
      {
        title: 'Automated Systems',
        icon: Bot,
        description: 'No need for manual trading or complex analysis'
      }
    ],
    experienced: [
      {
        title: 'Advanced Customization',
        icon: Settings,
        description: 'Fine-tune strategies to your exact specifications'
      },
      {
        title: 'API Integration',
        icon: Code,
        description: 'Connect with external tools and platforms'
      },
      {
        title: 'Multi-Strategy Deployment',
        icon: Layers,
        description: 'Run multiple strategies simultaneously'
      },
      {
        title: 'Professional Tools',
        icon: ChartBar,
        description: 'Advanced charting and analysis capabilities'
      }
    ]
  };

  const technologicalAdvantages = [
    {
      title: 'Quantum-Inspired Algorithms',
      icon: Sparkles,
      description: 'Our AI utilizes quantum-inspired algorithms for unprecedented market analysis accuracy'
    },
    {
      title: 'Neural Network Architecture',
      icon: Network,
      description: 'Deep learning networks process market data across multiple dimensions'
    },
    {
      title: 'Real-Time Adaptation',
      icon: Zap,
      description: 'Systems automatically adapt to changing market conditions'
    },
    {
      title: 'Advanced Backtesting',
      icon: ChartBar,
      description: 'Test strategies against decades of historical data in minutes'
    }
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-green border border-accent-green rounded-lg hover:bg-accent-green/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.1)_0%,transparent_100%)]" />
          <div className="cyber-grid absolute inset-0 opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-accent-green neon-text mb-6">
              Next-Generation Trading Platform
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of trading with our AI-powered platform, designed for both novice and professional traders. Harness the power of artificial intelligence to maximize your trading potential.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-holographic p-6 rounded-xl transform-gpu transition-all duration-500 hover:translate-z-[30px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-accent-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100">{feature.title}</h3>
                </div>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Benefits Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-accent-green neon-text mb-4">
              Perfect for Every Trader
            </h2>
            <p className="text-xl text-gray-400">
              Whether you're just starting or a seasoned professional, our platform adapts to your needs
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Novice Traders */}
            <div className="card card-holographic p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-accent-green" />
                <h3 className="text-2xl font-semibold text-gray-100">New to Trading?</h3>
              </div>
              <div className="grid gap-6">
                {userBenefits.novice.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-5 h-5 text-accent-green" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-200 mb-1">{benefit.title}</h4>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experienced Traders */}
            <div className="card card-holographic p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-accent-green" />
                <h3 className="text-2xl font-semibold text-gray-100">Professional Trader?</h3>
              </div>
              <div className="grid gap-6">
                {userBenefits.experienced.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-5 h-5 text-accent-green" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-200 mb-1">{benefit.title}</h4>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-accent-green neon-text mb-4">
              Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-400">
              Powered by the latest advancements in artificial intelligence and machine learning
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {technologicalAdvantages.map((tech, index) => (
              <div key={index} className="card card-holographic p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
                    <tech.icon className="w-6 h-6 text-accent-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100">{tech.title}</h3>
                </div>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-accent-green neon-text mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of traders who have already discovered the power of AI-driven trading
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 text-dark font-medium bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              Get Started Now
            </Link>
            <Link
              to="/docs"
              className="px-6 py-3 text-accent-green font-medium border border-accent-green rounded-lg hover:bg-accent-green/10 transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Risk Warning */}
      <div className="bg-dark-card/50 border-t border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-accent-red mb-4">
            Risk Disclaimer
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Trading involves significant risk of loss and is not suitable for all investors. The sophisticated algorithms and AI systems, while advanced, do not guarantee profits. Please ensure you understand the risks involved and never trade with money you cannot afford to lose. Past performance does not indicate future results.
          </p>
        </div>
      </div>
    </div>
  );
};