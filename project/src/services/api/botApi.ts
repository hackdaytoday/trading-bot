import { botService } from '../bot';
import { Strategy } from '../bot/types';
import { metaApiService } from '../metaapi';
import toast from 'react-hot-toast';

class BotApi {
  async startAutoTrade(strategy: Strategy): Promise<void> {
    try {
      if (!metaApiService.isConnected()) {
        throw new Error('Not connected to MetaApi');
      }

      const connection = await metaApiService.getConnection();
      await botService.startBot(connection, strategy.name);
      toast.success('Auto Trade started successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start Auto Trade';
      toast.error(message);
      throw error;
    }
  }

  stopAutoTrade(): void {
    try {
      botService.stopBot();
      toast.success('Auto Trade stopped successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop Auto Trade';
      toast.error(message);
      throw error;
    }
  }

  getAutoTradeStatus() {
    try {
      return botService.getBotStatus();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get Auto Trade status';
      toast.error(message);
      throw error;
    }
  }

  addStrategy(strategy: Strategy): void {
    try {
      botService.addStrategy(strategy);
      toast.success(`Strategy "${strategy.name}" added successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add strategy';
      toast.error(message);
      throw error;
    }
  }

  getStrategies(): Strategy[] {
    try {
      return botService.getStrategies();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get strategies';
      toast.error(message);
      throw error;
    }
  }
}

export const botApi = new BotApi();