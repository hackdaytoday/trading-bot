// Usuwamy import Buffer i dodajemy polyfill
const bufferPolyfill = {
  from: (data: string) => new Uint8Array(Buffer.from(data)),
  alloc: (size: number) => new Uint8Array(size),
  allocUnsafe: (size: number) => new Uint8Array(size),
  isBuffer: (obj: any) => obj instanceof Uint8Array
};

(window as any).Buffer = bufferPolyfill;

import axios from 'axios';
import { MetaTraderAccount } from '../types/metaTrader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const META_API_TOKEN = import.meta.env.VITE_META_API_TOKEN;

export const getAccountInfo = async (): Promise<MetaTraderAccount> => {
  try {
    const response = await axios.get(`${API_URL}/api/account`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get account information');
  }
};

export const metaApiService = {
  async connect(server: string, login: string, password: string): Promise<MetaTraderAccount> {
    try {
      const response = await axios.post(`${API_URL}/api/connect`, {
        server,
        login,
        password,
        token: META_API_TOKEN
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to connect to MetaTrader');
    }
  },

  async disconnect(): Promise<void> {
    try {
      await axios.post(`${API_URL}/api/disconnect`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to disconnect from MetaTrader');
    }
  },

  getAccountInfo
};

export default metaApiService;