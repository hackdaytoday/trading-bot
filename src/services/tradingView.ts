import { EventEmitter } from 'events';
import { metaApiService } from './metaapi';

interface PriceData {
  last: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
}

class TradingViewService extends EventEmitter {
  private subscriptions: Set<string> = new Set();
  private prices: Map<string, PriceData> = new Map();
  private updateInterval: NodeJS.Timer | null = null;
  private lastPrices: Map<string, number> = new Map();

  constructor() {
    super();
    this.startUpdates();
  }

  private async startUpdates() {
    // Update prices every 100ms for maximum accuracy
    this.updateInterval = setInterval(async () => {
      if (!metaApiService.isConnected()) return;

      const connection = metaApiService.getConnection();
      if (!connection) return;

      for (const symbol of this.subscriptions) {
        try {
          // Get price directly from connection
          const price = await connection.getSymbolPrice(symbol);
          if (!price || !price.bid || !price.ask) continue;

          const lastPrice = this.lastPrices.get(symbol) || price.bid;
          const change = price.bid - lastPrice;
          const changePercent = (change / lastPrice) * 100;

          const priceData: PriceData = {
            last: (price.bid + price.ask) / 2,
            bid: price.bid,
            ask: price.ask,
            high: price.bid + (price.ask - price.bid),
            low: price.bid - (price.ask - price.bid),
            volume: 0,
            change,
            changePercent
          };

          this.prices.set(symbol, priceData);
          this.lastPrices.set(symbol, price.bid);
          this.emit('price_update', { symbol, data: priceData });
        } catch (error) {
          console.warn(`Failed to get price for ${symbol}:`, error);
        }
      }
    }, 100); // Update every 100ms
  }

  public subscribeToSymbol(symbol: string): void {
    this.subscriptions.add(symbol);
    
    // Try to get initial price
    if (metaApiService.isConnected()) {
      const connection = metaApiService.getConnection();
      if (connection) {
        connection.getSymbolPrice(symbol)
          .then(price => {
            if (price && price.bid && price.ask) {
              const priceData: PriceData = {
                last: (price.bid + price.ask) / 2,
                bid: price.bid,
                ask: price.ask,
                high: price.bid + (price.ask - price.bid),
                low: price.bid - (price.ask - price.bid),
                volume: 0,
                change: 0,
                changePercent: 0
              };
              this.prices.set(symbol, priceData);
              this.lastPrices.set(symbol, price.bid);
              this.emit('price_update', { symbol, data: priceData });
            }
          })
          .catch(error => console.warn(`Failed to get initial price for ${symbol}:`, error));
      }
    }
  }

  public unsubscribeFromSymbol(symbol: string): void {
    this.subscriptions.delete(symbol);
    this.prices.delete(symbol);
    this.lastPrices.delete(symbol);
  }

  public getPrice(symbol: string): PriceData | null {
    return this.prices.get(symbol) || null;
  }

  public cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.subscriptions.clear();
    this.prices.clear();
    this.lastPrices.clear();
    this.removeAllListeners();
  }
}

export const tradingView = new TradingViewService();