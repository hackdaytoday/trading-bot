import { Buffer } from 'buffer';

window.Buffer = Buffer;

export interface AccountInfo {
  balance: number;
  previousBalance: number;
  equity: number;
  previousEquity: number;
  margin: number;
  previousMargin: number;
  freeMargin: number;
  previousFreeMargin: number;
  profit: number;
  previousProfit: number;
  leverage: number;
  currency: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
  maxPositionSize: number;
  balanceHistory: Array<{ timestamp: number; value: number }>;
  equityHistory: Array<{ timestamp: number; value: number }>;
  marginHistory: Array<{ timestamp: number; value: number }>;
  freeMarginHistory: Array<{ timestamp: number; value: number }>;
  profitHistory: Array<{ timestamp: number; value: number }>;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  totalProfit: number;
  totalLoss: number;
}

interface Position {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  openPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  profit: number;
}

class MetaApiService {
  private connectionId: string | null = null;
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL;
    if (!this.apiUrl) {
      throw new Error('Brak adresu API');
    }
  }

  public async connect(server: string, login: string, password: string): Promise<AccountInfo> {
    try {
      console.log('Próba połączenia z kontem MT5:', { server, login });

      const response = await fetch(`${this.apiUrl}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          server: server.trim(), 
          login: login.trim(), 
          password: password 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Błąd odpowiedzi serwera:', error);
        throw new Error(error.error || 'Nie udało się połączyć z kontem MT5');
      }

      const data = await response.json();
      console.log('Otrzymano odpowiedź:', data);
      
      if (!data.connectionId) {
        throw new Error('Brak identyfikatora połączenia w odpowiedzi');
      }
      
      this.connectionId = data.connectionId;
      return data.accountInfo;
    } catch (error: any) {
      console.error('Błąd podczas łączenia z kontem MT5:', error);
      throw new Error(error.message || 'Nie udało się połączyć z kontem MT5');
    }
  }

  public async waitForConnection(timeout: number = 60000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (this.connectionId) {
        try {
          // Spróbuj pobrać dane konta, aby upewnić się, że połączenie działa
          await this.getAccountInfo();
          return;
        } catch (error) {
          console.log('Oczekiwanie na aktywne połączenie...');
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Nie udało się połączyć z kontem MT5 w wyznaczonym czasie');
  }

  private async ensureConnection(): Promise<void> {
    if (!this.connectionId) {
      throw new Error('Brak połączenia z kontem MT5');
    }

    try {
      const response = await fetch(`${this.apiUrl}/connection/${this.connectionId}`);
      if (!response.ok) {
        this.connectionId = null;
        throw new Error('Utracono połączenie z kontem MT5');
      }
    } catch (error) {
      this.connectionId = null;
      throw new Error('Utracono połączenie z kontem MT5');
    }
  }

  public async getAccountInfo(): Promise<AccountInfo> {
    await this.ensureConnection();

    try {
      const response = await fetch(`${this.apiUrl}/account/${this.connectionId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Nie udało się pobrać informacji o koncie');
      }

      return await response.json();
    } catch (error) {
      console.error('Błąd podczas pobierania informacji o koncie MT5:', error);
      throw error;
    }
  }

  public async getPositions(): Promise<Position[]> {
    await this.ensureConnection();

    try {
      const response = await fetch(`${this.apiUrl}/positions/${this.connectionId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Nie udało się pobrać pozycji');
      }

      return await response.json();
    } catch (error) {
      console.error('Błąd podczas pobierania pozycji:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connectionId) return;

    try {
      await fetch(`${this.apiUrl}/disconnect/${this.connectionId}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Błąd podczas rozłączania:', error);
    } finally {
      this.connectionId = null;
    }
  }

  public isConnected() {
    return this.connectionId !== null;
  }
}

export const metaApiService = new MetaApiService();
export const getAccountInfo = () => metaApiService.getAccountInfo();