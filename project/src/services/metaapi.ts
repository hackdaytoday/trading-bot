import axios from 'axios';
import { MetaTraderAccount } from '../types/metaTrader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class MetaApiService {
  async connect(server: string, login: string, password: string): Promise<MetaTraderAccount> {
    try {
      const response = await axios.post(`${API_URL}/connect`, {
        server,
        login,
        password
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to connect to MetaTrader');
    }
  }

  async getAIAnalysis(): Promise<string> {
    try {
      const response = await axios.get(`${API_URL}/analysis`);
      return response.data.analysis;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get AI analysis');
    }
  }
}

export const metaApiService = new MetaApiService();
