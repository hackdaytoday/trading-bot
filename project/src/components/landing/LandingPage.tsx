import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MatrixRain } from '../effects/MatrixRain';
import { NeuralNetwork } from '../effects/NeuralNetwork';
import { ParticleSystem } from '../effects/ParticleSystem';
import { HolographicGrid } from '../effects/HolographicGrid';
import { 
  Brain, ChevronRight, Bot, Shield, Activity, TrendingUp, 
  AlertTriangle, Cpu, LineChart, Lock, Zap, Globe, Target, 
  Layers, Rocket, Code, Database, Network, Workflow, ArrowRight, 
  BarChart2, Wallet, DollarSign, BarChart as ChartBar, MessageCircle,
  ArrowUpRight, ArrowDownRight, Building2 as BuildingIcon, Sparkles
} from 'lucide-react';

const BotSvg = () => (
  <svg
    className="w-64 h-64 text-accent-green opacity-80"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </svg>
);

export const LandingPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'data-collection',
      title: 'Data Collection & Analysis',
      icon: Brain,
      description: 'Real-time market data processing and analysis',
      steps: [
        'Collect high-frequency market data',
        'Process and normalize data streams',
        'Apply advanced filtering algorithms',
        'Identify key market patterns'
      ]
    },
    {
      id: 'ai-processing',
      title: 'AI Signal Processing',
      icon: Cpu,
      description: 'Neural network-based signal generation',
      steps: [
        'Feed data through neural networks',
        'Apply machine learning models',
        'Generate trading signals',
        'Validate signal strength'
      ]
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      icon: Shield,
      description: 'Advanced risk control systems',
      steps: [
        'Calculate position sizing',
        'Set dynamic stop losses',
        'Monitor exposure levels',
        'Adjust for volatility'
      ]
    },
    {
      id: 'execution',
      title: 'Trade Execution',
      icon: Bot,
      description: 'High-speed automated trading',
      steps: [
        'Validate trading conditions',
        'Execute orders with precision',
        'Monitor order status',
        'Record trade details'
      ]
    }
  ];

  const subscriptionPlans = [
    {
      name: 'Basic',
      price: 'Free',
      period: '/month',
      description: 'Perfect for beginners',
      features: [
        'Basic AI analysis',
        'Manual trading assistance',
        'Standard indicators',
        'Email support',
        'Basic risk management'
      ],
      color: 'from-accent-green/20 to-accent-green/5',
      buttonColor: 'bg-accent-green hover:bg-accent-green/90',
      icon: Bot
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious traders',
      features: [
        'Advanced AI signals',
        'Semi-automated trading',
        'Premium indicators',
        'Priority support',
        'Enhanced risk management',
        'Portfolio optimization'
      ],
      color: 'from-accent-green/20 to-accent-green/5',
      buttonColor: 'bg-accent-green hover:bg-accent-green/90',
      recommended: true,
      icon: Brain
    },
    {
      name: 'Enterprise',
      price: '$29',
      period: '/month',
      description: 'Full automation suite',
      features: [
        'Full AI automation',
        'Custom strategies',
        'Advanced portfolio management',
        '24/7 dedicated support',
        'Real-time risk monitoring',
        'Multi-account management',
        'API access'
      ],
      color: 'from-accent-green/20 to-accent-green/5',
      buttonColor: 'bg-accent-green hover:bg-accent-green/90',
      icon: Rocket
    },
    {
      name: 'Institutional',
      price: '$49',
      period: '/month',
      description: 'Enterprise-grade solution',
      features: [
        'Custom AI models',
        'Dedicated infrastructure',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced reporting',
        'SLA guarantee',
        'White-label options'
      ],
      color: 'from-accent-green/20 to-accent-green/5',
      buttonColor: 'bg-accent-green hover:bg-accent-green/90',
      icon: BuildingIcon
    }
  ];

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
    <div className="min-h-screen bg-dark text-gray-100">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.1)_0%,transparent_100%)]" />
        <MatrixRain />
        <NeuralNetwork />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/50 to-dark" />
        <HolographicGrid />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <ParticleSystem />
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-green border border-accent-green rounded-lg hover:bg-accent-green/10 transition-colors"
        >
          <Bot className="w-4 h-4" />
          Launch Platform
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.1)_0%,transparent_100%)]" />
          <div className="cyber-grid absolute inset-0 opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8 relative">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse bg-accent-green/20 rounded-full filter blur-xl"></div>
                <div className="relative transform hover:scale-105 transition-transform duration-300">
                  <BotSvg />
                </div>
                {/* Orbiting particles */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-accent-green rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 45}deg) translateX(150px)`,
                        animation: `pulse 2s ease-in-out ${i * 0.25}s infinite`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <h1 
              className="text-4xl md:text-6xl font-bold text-accent-green neon-text mb-6 glitch-effect" 
              data-text="STH Neural Command Center"
            >
              STH Neural Command Center
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Autonomous AI Trading System with Military-Grade Precision and Tactical Market Execution
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 text-dark font-medium bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
              >
                Get Started
              </Link>
              <Link
                to="/learn-more"
                className="px-6 py-3 text-accent-green font-medium border border-accent-green rounded-lg hover:bg-accent-green/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-accent-green neon-text mb-4">
              Trading Process Flow
            </h2>
            <p className="text-xl text-gray-400">
              Our advanced AI system follows a precise workflow for optimal trading
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className="w-full"
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className={`
                      relative transform-gpu transition-all duration-500
                      ${activeSection === index 
                        ? 'translate-z-[40px] scale-[1.02]' 
                        : 'hover:translate-z-[20px] hover:scale-[1.01]'
                      }
                    `}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className={`w-full text-left p-6 rounded-xl transition-all duration-500 ${
                      activeSection === index
                        ? 'neon-border glow-border bg-accent-green/10'
                        : 'bg-dark-card/80 border border-gray-800 hover:border-accent-green/50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg transform transition-all duration-300 ${
                          activeSection === index
                            ? 'bg-accent-green/20 rotate-12'
                            : 'bg-dark group-hover:rotate-12'
                        }`}>
                          <section.icon className={`w-6 h-6 ${
                            activeSection === index
                              ? 'text-accent-green'
                              : 'text-gray-400 group-hover:text-accent-green'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                            activeSection === index
                              ? 'text-accent-green'
                              : 'text-gray-200 group-hover:text-accent-green'
                          }`}>
                            {section.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {section.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 transform transition-all duration-300 ${
                          activeSection === index
                            ? 'rotate-90 text-accent-green'
                            : 'text-gray-500 group-hover:translate-x-1'
                        }`} />
                      </div>

                      <div className={`mt-6 grid gap-3 transition-all duration-500 ${
                        activeSection === index 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4 hidden'
                      }`}>
                        {section.steps.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-center gap-3 text-sm text-gray-300"
                            style={{
                              animation: `slideIn 0.5s ease-out ${stepIndex * 0.1}s forwards`
                            }}
                          >
                            <div className="relative">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                              <div className="absolute inset-0 bg-accent-green/30 rounded-full animate-ping" />
                            </div>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative" style={{ perspective: '2000px' }}>
              <div 
                className="transform-gpu transition-all duration-500 hover:translate-z-[30px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="card neon-border rounded-xl p-8 bg-dark-card/50 backdrop-blur-sm">
                  <div 
                    className="aspect-square rounded-lg bg-dark relative overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05)_0%,transparent_70%)]" />
                      <div className="cyber-grid absolute inset-0 opacity-10" />
                    </div>

                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="rotating-box">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute inset-0 border-2 border-accent-green/20 rounded-lg transform-gpu"
                            style={{
                              animation: `rotate-3d 20s linear infinite ${i * 0.5}s`,
                              transform: `rotateX(${i * 45}deg) rotateY(${i * 45}deg) translateZ(150px)`,
                              backfaceVisibility: 'hidden'
                            }}
                          />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BotSvg />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-accent-green neon-text mb-4">
              Subscription Plans
            </h2>
            <p className="text-xl text-gray-400">
              Choose the perfect plan for your trading needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative card card-holographic p-6 rounded-xl bg-dark-card/30 backdrop-blur-sm border border-accent-green/20 transform hover:scale-105 transition-all duration-300 ${
                  plan.recommended ? 'ring-2 ring-accent-green shadow-lg' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent-green text-dark px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-accent-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-100">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${plan.buttonColor} text-dark`}
                >
                  Get Started
                </button>
              </div>
            ))}
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-6 bg-dark-card/90 backdrop-blur-sm rounded-lg border-2 border-accent-red shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <h3 className="text-2xl font-bold text-accent-red mb-6 flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Important Risk Disclosure and Disclaimer
            </h3>
            
            <div className="space-y-4 text-left">
              {/* Trading Risks */}
              <div className="p-4 bg-dark/50 rounded-lg border border-accent-red/20">
                <h4 className="text-lg font-semibold text-accent-red mb-2">Trading Risks</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Trading in financial markets carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work both for and against you. Before deciding to trade any financial instruments you should carefully consider your investment objectives, level of experience, and risk appetite.
                </p>
              </div>

              {/* Potential Loss Warning */}
              <div className="p-4 bg-dark/50 rounded-lg border border-accent-red/20">
                <h4 className="text-lg font-semibold text-accent-red mb-2">Potential Loss Warning</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. If you are in any doubt, you should seek independent financial advice.
                </p>
              </div>

              {/* AI Trading Disclaimer */}
              <div className="p-4 bg-dark/50 rounded-lg border border-accent-red/20">
                <h4 className="text-lg font-semibold text-accent-red mb-2">AI Trading System Disclaimer</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The AI trading system and its algorithms are experimental tools with no guarantee of profitability. Past performance is not indicative of future results. The system may fail under different market conditions or produce losses.
                </p>
              </div>

              {/* Legal Disclaimer */}
              <div className="p-4 bg-dark/50 rounded-lg border border-accent-red/20">
                <h4 className="text-lg font-semibold text-accent-red mb-2">Legal Disclaimer</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The information provided on this platform is for general informational purposes only and does not constitute investment advice. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the trading system or the information, products, services, or related graphics contained on the platform.
                </p>
              </div>

              {/* Liability Waiver */}
              <div className="p-4 bg-dark/50 rounded-lg border border-accent-red/20">
                <h4 className="text-lg font-semibold text-accent-red mb-2">Liability Waiver</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this trading system.
                </p>
              </div>

              {/* Acknowledgment */}
              <div className="mt-6 p-4 bg-accent-red/5 rounded-lg border border-accent-red">
                <p className="text-accent-red text-sm font-medium">
                  By using this platform, you acknowledge that you have read, understood, and agree to be bound by all applicable risk disclosures, disclaimers, and terms of service. Trading involves significant risk of loss and is not suitable for all investors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};