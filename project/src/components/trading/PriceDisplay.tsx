import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { tradingView } from '../../services/tradingView';
import { useAuth } from '../../contexts/AuthContext';
import { metaApiService } from '../../services/metaapi';

interface PriceDisplayProps {
  symbol: string;
  showDetails?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ symbol, showDetails = false }) => {
  const { user } = useAuth();
  const [price, setPrice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState(new Date());

  useEffect(() => {
    let mounted = true;
    let updateInterval: NodeJS.Timer;

    const updatePrice = async () => {
      if (!user?.metaTrader.connected) return;

      try {
        const connection = metaApiService.getConnection();
        if (!connection) return;

        const currentPrice = await connection.getSymbolPrice(symbol);
        if (!currentPrice || !mounted) return;

        const lastPrice = price?.last || currentPrice.bid;
        const change = currentPrice.bid - lastPrice;
        const changePercent = (change / lastPrice) * 100;

        const priceData = {
          last: (currentPrice.bid + currentPrice.ask) / 2,
          bid: currentPrice.bid,
          ask: currentPrice.ask,
          high: currentPrice.bid + (currentPrice.ask - currentPrice.bid),
          low: currentPrice.bid - (currentPrice.ask - currentPrice.bid),
          volume: 0,
          change,
          changePercent
        };

        setPrice(priceData);
        setIsLoading(false);
        setUpdateTime(new Date());
      } catch (error) {
        console.warn(`Failed to get price for ${symbol}:`, error);
      }
    };

    const startPriceUpdates = () => {
      // Initial update
      updatePrice();

      // Update every 100ms
      updateInterval = setInterval(updatePrice, 100);
    };

    startPriceUpdates();

    return () => {
      mounted = false;
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [symbol, user?.metaTrader.connected]);

  if (!user?.metaTrader.connected) {
    return (
      <div className="text-gray-400">
        Connect to MetaTrader to see live prices
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-6 w-24 bg-gray-700 rounded"></div>
        {showDetails && (
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 w-28 bg-gray-700 rounded"></div>
          </div>
        )}
      </div>
    );
  }

  if (!price) {
    return (
      <div className="text-gray-400">
        Price unavailable
      </div>
    );
  }

  const formatPrice = (value: number) => {
    switch (symbol) {
      case 'BTCUSD':
        return value.toFixed(2);
      case 'XAUUSD':
        return value.toFixed(2);
      default:
        return value.toFixed(5);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-100">
            ${formatPrice(price.last)}
          </span>
          <div className={`flex items-center ${
            price.change >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {price.change >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(price.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Last update: {updateTime.toLocaleTimeString([], { hour12: false })}
        </div>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Bid:</span>
            <span className="ml-2 text-gray-200">
              ${formatPrice(price.bid)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Ask:</span>
            <span className="ml-2 text-gray-200">
              ${formatPrice(price.ask)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Spread:</span>
            <span className="ml-2 text-gray-200">
              {((price.ask - price.bid) * (symbol === 'XAUUSD' ? 100 : 100000)).toFixed(1)} points
            </span>
          </div>
          <div>
            <span className="text-gray-400">Change:</span>
            <span className={`ml-2 ${price.change >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {formatPrice(Math.abs(price.change))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};