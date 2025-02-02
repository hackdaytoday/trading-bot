import { EventEmitter } from 'events';

interface PriceLevels {
  entry: number;
  stopLoss: number;
  takeProfit: number;
}

interface TechnicalAnalysis {
  direction: 'buy' | 'sell' | null;
  probability: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  signals: string[];
}

export class TechnicalAnalysisService extends EventEmitter {
  // Calculate optimal entry price based on multiple indicators
  public calculateEntryPrice(
    currentPrice: { bid: number; ask: number },
    indicators: {
      rsi?: number;
      macd?: { macd: number; signal: number; histogram: number };
      bollinger?: { upper: number; middle: number; lower: number };
      atr?: number;
    }
  ): number {
    const midPrice = (currentPrice.bid + currentPrice.ask) / 2;
    
    if (indicators.bollinger) {
      // Use Bollinger Bands for entry refinement
      if (midPrice > indicators.bollinger.upper) {
        return indicators.bollinger.upper; // Sell entry
      } else if (midPrice < indicators.bollinger.lower) {
        return indicators.bollinger.lower; // Buy entry
      }
    }
    
    return midPrice;
  }

  // Calculate stop loss based on ATR and support/resistance
  public calculateStopLoss(
    type: 'buy' | 'sell',
    entryPrice: number,
    atr: number,
    multiplier: number = 1.5
  ): number {
    const stopDistance = atr * multiplier;
    return type === 'buy' 
      ? entryPrice - stopDistance
      : entryPrice + stopDistance;
  }

  // Calculate take profit based on risk/reward ratio
  public calculateTakeProfit(
    type: 'buy' | 'sell',
    entryPrice: number,
    stopLoss: number,
    riskRewardRatio: number = 2.0
  ): number {
    const riskDistance = Math.abs(entryPrice - stopLoss);
    const rewardDistance = riskDistance * riskRewardRatio;
    
    return type === 'buy'
      ? entryPrice + rewardDistance
      : entryPrice - rewardDistance;
  }

  // Calculate trade probability based on multiple indicators
  public calculateProbability(
    indicators: {
      rsi?: number;
      macd?: { macd: number; signal: number; histogram: number };
      trend?: 'up' | 'down' | 'sideways';
      momentum?: number;
      volumeStrength?: number;
    }
  ): number {
    let probability = 50; // Base probability

    // RSI contribution
    if (indicators.rsi !== undefined) {
      if (indicators.rsi < 30) probability += 10; // Oversold
      if (indicators.rsi > 70) probability -= 10; // Overbought
    }

    // MACD contribution
    if (indicators.macd) {
      if (indicators.macd.histogram > 0) probability += 5;
      if (indicators.macd.histogram < 0) probability -= 5;
      if (Math.abs(indicators.macd.histogram) > 0.0002) probability += 5;
    }

    // Trend contribution
    if (indicators.trend) {
      if (indicators.trend === 'up') probability += 10;
      if (indicators.trend === 'down') probability -= 10;
    }

    // Volume contribution
    if (indicators.volumeStrength && indicators.volumeStrength > 1.2) {
      probability += 10;
    }

    // Ensure probability is within bounds
    return Math.min(Math.max(probability, 0), 100);
  }

  // Comprehensive analysis combining all indicators
  public async analyzeMarket(
    price: { bid: number; ask: number },
    indicators: {
      rsi?: number;
      macd?: { macd: number; signal: number; histogram: number };
      bollinger?: { upper: number; middle: number; lower: number };
      atr?: number;
      trend?: 'up' | 'down' | 'sideways';
      momentum?: number;
      volumeStrength?: number;
    }
  ): Promise<TechnicalAnalysis> {
    // Determine trade direction
    let direction: 'buy' | 'sell' | null = null;
    const signals: string[] = [];

    // RSI Analysis
    if (indicators.rsi !== undefined) {
      if (indicators.rsi < 30) {
        direction = 'buy';
        signals.push('RSI indicates oversold conditions');
      } else if (indicators.rsi > 70) {
        direction = 'sell';
        signals.push('RSI indicates overbought conditions');
      }
    }

    // MACD Analysis
    if (indicators.macd) {
      if (indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal) {
        if (direction === 'buy') signals.push('MACD confirms bullish momentum');
        else if (!direction) direction = 'buy';
      } else if (indicators.macd.histogram < 0 && indicators.macd.macd < indicators.macd.signal) {
        if (direction === 'sell') signals.push('MACD confirms bearish momentum');
        else if (!direction) direction = 'sell';
      }
    }

    // Bollinger Bands Analysis
    if (indicators.bollinger) {
      const midPrice = (price.bid + price.ask) / 2;
      if (midPrice < indicators.bollinger.lower) {
        if (direction === 'buy') signals.push('Price below lower Bollinger Band');
        else if (!direction) direction = 'buy';
      } else if (midPrice > indicators.bollinger.upper) {
        if (direction === 'sell') signals.push('Price above upper Bollinger Band');
        else if (!direction) direction = 'sell';
      }
    }

    if (!direction) return null;

    // Calculate entry, stop loss, and take profit
    const entry = this.calculateEntryPrice(price, indicators);
    const stopLoss = this.calculateStopLoss(
      direction,
      entry,
      indicators.atr || 0.0020
    );
    const takeProfit = this.calculateTakeProfit(direction, entry, stopLoss);

    // Calculate probability
    const probability = this.calculateProbability(indicators);

    // Calculate risk/reward ratio
    const riskDistance = Math.abs(entry - stopLoss);
    const rewardDistance = Math.abs(entry - takeProfit);
    const riskRewardRatio = rewardDistance / riskDistance;

    return {
      direction,
      probability,
      entry,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      signals
    };
  }

  // Validate price levels
  public validatePriceLevels(
    levels: PriceLevels,
    currentPrice: { bid: number; ask: number },
    minDistance: number = 0.0010
  ): boolean {
    const { entry, stopLoss, takeProfit } = levels;
    const midPrice = (currentPrice.bid + currentPrice.ask) / 2;

    // Check minimum distances
    if (Math.abs(entry - stopLoss) < minDistance) return false;
    if (Math.abs(entry - takeProfit) < minDistance) return false;
    if (Math.abs(entry - midPrice) < currentPrice.ask - currentPrice.bid) return false;

    return true;
  }
}

export const technicalAnalysis = new TechnicalAnalysisService();