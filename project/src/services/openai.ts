// ... keep existing imports and class definition ...

private generateMockAnalysis(market: string, price: { bid: number, ask: number }) {
  const direction = Math.random() > 0.5 ? 'bullish' : 'bearish';
  const probability = Math.floor(65 + Math.random() * 25);
  const currentPrice = (price.bid + price.ask) / 2;
  const atr = 0.0020; // Sample ATR for mock data

  // Instead of showing real prices, use asterisks
  const entryPrice = '*****';
  const stopLoss = '*****';
  const takeProfit = '*****';
  
  // Calculate risk/reward ratio but don't expose actual prices
  const riskRewardRatio = 1.67; // Fixed sample ratio

  const signals = [
    direction === 'bullish' ? 'Strong momentum detected' : 'Momentum weakening',
    direction === 'bullish' ? 'Key support level holding' : 'Resistance level reached',
    'Volume confirmation',
    direction === 'bullish' ? 'Higher lows forming' : 'Lower highs forming',
    direction === 'bullish' ? 'RSI showing oversold conditions' : 'RSI showing overbought conditions'
  ];

  const insights = [
    {
      type: 'signal',
      message: `${direction.charAt(0).toUpperCase() + direction.slice(1)} trend forming on ${market}`,
      impact: 'medium'
    },
    {
      type: 'warning',
      message: `Increased volatility expected in next trading session`,
      impact: 'high'
    },
    {
      type: 'signal',
      message: `Key technical levels approaching`,
      impact: 'medium'
    }
  ];

  return {
    direction,
    probability,
    signals,
    insights,
    entryPrice: '*****',
    stopLoss: '*****',
    takeProfit: '*****',
    riskRewardRatio: 1.67
  };
}

// ... keep rest of the class implementation ...