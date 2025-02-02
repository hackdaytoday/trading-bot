import { EventEmitter } from 'events';

interface AIPrediction {
  direction: 'buy' | 'sell' | 'neutral';
  confidence: number;
  priceTargets: {
    short: { price: number; confidence: number };
    medium: { price: number; confidence: number };
    long: { price: number; confidence: number };
  };
  supportResistance: {
    support: number[];
    resistance: number[];
  };
  riskAnalysis: {
    riskScore: number;
    volatilityForecast: number;
  };
  marketConditions: {
    trend: string;
    momentum: string;
    volatility: string;
    volume: string;
  };
}

class AIPredictionService extends EventEmitter {
  private lastPrediction: Map<string, AIPrediction> = new Map();

  public async analyzePriceAction(symbol: string): Promise<AIPrediction> {
    try {
      // Generate mock prediction for development
      const prediction = this.generateMockPrediction(symbol);
      this.lastPrediction.set(symbol, prediction);
      return prediction;
    } catch (error) {
      console.error('AI prediction error:', error);
      return this.lastPrediction.get(symbol) || this.generateMockPrediction(symbol);
    }
  }

  private generateMockPrediction(symbol: string): AIPrediction {
    const basePrice = symbol === 'XAUUSD' ? 1950.00 : 1.1000;
    const volatility = 0.002;
    const trend = Math.random() > 0.5 ? 'bullish' : 'bearish';
    const momentum = Math.random() > 0.5 ? 'strong' : 'weak';
    const confidence = 0.65 + Math.random() * 0.25;

    return {
      direction: trend === 'bullish' ? 'buy' : 'sell',
      confidence,
      priceTargets: {
        short: {
          price: basePrice * (1 + (trend === 'bullish' ? 1 : -1) * volatility),
          confidence: 0.8
        },
        medium: {
          price: basePrice * (1 + (trend === 'bullish' ? 2 : -2) * volatility),
          confidence: 0.6
        },
        long: {
          price: basePrice * (1 + (trend === 'bullish' ? 3 : -3) * volatility),
          confidence: 0.4
        }
      },
      supportResistance: {
        support: [
          basePrice * 0.995,
          basePrice * 0.997,
          basePrice * 0.999
        ],
        resistance: [
          basePrice * 1.001,
          basePrice * 1.003,
          basePrice * 1.005
        ]
      },
      riskAnalysis: {
        riskScore: 35 + Math.random() * 30,
        volatilityForecast: volatility
      },
      marketConditions: {
        trend,
        momentum,
        volatility: volatility > 0.003 ? 'high' : 'moderate',
        volume: Math.random() > 0.5 ? 'increasing' : 'stable'
      }
    };
  }

  public getLastPrediction(symbol: string): AIPrediction | null {
    return this.lastPrediction.get(symbol) || null;
  }
}

export const aiPrediction = new AIPredictionService();