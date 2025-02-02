import React from 'react';
import { MetricHistory } from '../../types/tradingMetrics';
import SparklineChart from './SparklineChart';

interface MetricCardProps {
    title: string;
    value?: number;
    change?: number;
    history?: MetricHistory[];
    icon?: React.ReactNode;
    className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value = 0, 
    change = 0, 
    history = [], 
    icon,
    className = ''
}) => {
    return (
        <div className={`bg-dark-card p-6 rounded-lg card card-3d neon-border ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">{title}</span>
                {icon && <div className="text-accent-green">{icon}</div>}
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-100">
                        ${value.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${change >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {change > 0 ? '+' : ''}{change.toFixed(2)}%
                    </span>
                </div>
                <div className="h-10">
                    {history && history.length > 0 && (
                        <SparklineChart data={history.map(h => ({ value: h.value || 0, timestamp: h.timestamp || 0 }))} />
                    )}
                </div>
                <div className="text-xs text-gray-400">
                    Last update: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};

export default MetricCard;
