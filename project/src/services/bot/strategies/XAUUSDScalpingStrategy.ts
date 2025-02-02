import { Strategy, TradeSignal } from '../types';

export class XAUUSDScalpingStrategy implements Strategy {
  // ... keep existing properties ...

  private async getPrice(connection: any): Promise<{ bid: number; ask: number } | null> {
    for (let i = 0; i < this.retryAttempts; i++) {
      try {
        const price = await connection.terminalState.getSymbolPrice(this.symbol);
        if (price && typeof price.bid === 'number' && typeof price.ask === 'number') {
          return price;
        }
      } catch (error) {
        console.warn(`Price fetch attempt ${i + 1} failed:`, error);
        if (i === this.retryAttempts - 1) return null;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    return null;
  }

  private async getCandles(connection: any): Promise<any[] | null> {
    for (let i = 0; i < this.retryAttempts; i++) {
      try {
        const candles = await connection.terminalState.getHistoricalCandles(this.symbol, '1m', this.minCandleCount);
        if (Array.isArray(candles) && candles.length >= this.minCandleCount) {
          return candles;
        }
      } catch (error) {
        console.warn(`Candles fetch attempt ${i + 1} failed:`, error);
        if (i === this.retryAttempts - 1) return null;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    return null;
  }

  private async getPositions(connection: any): Promise<any[] | null> {
    for (let i = 0; i < this.retryAttempts; i++) {
      try {
        const positions = await connection.terminalState.getPositions();
        if (Array.isArray(positions)) {
          return positions;
        }
      } catch (error) {
        console.warn(`Positions fetch attempt ${i + 1} failed:`, error);
        if (i === this.retryAttempts - 1) return null;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    return null;
  }

  // ... keep rest of the class implementation ...
}