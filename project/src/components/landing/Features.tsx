import React from 'react';
import { FaRobot, FaChartLine, FaBrain, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    name: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze market trends and patterns in real-time.',
    icon: FaBrain,
  },
  {
    name: 'Automated Trading',
    description: 'Execute trades automatically based on predefined strategies and market conditions.',
    icon: FaRobot,
  },
  {
    name: 'Performance Tracking',
    description: 'Comprehensive dashboard with detailed statistics and performance metrics.',
    icon: FaChartLine,
  },
  {
    name: 'Secure Platform',
    description: 'Enterprise-grade security measures to protect your trading account and data.',
    icon: FaShieldAlt,
  },
];

const Features: React.FC = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to trade
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our trading bot combines advanced AI technology with robust automation features to help you trade more effectively.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
