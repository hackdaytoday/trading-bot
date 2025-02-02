import { useEffect, useState } from 'react';
import { botApi } from '../services/api/botApi';

export function useBot() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setStatus(await botApi.getAutoTradeStatus());
      } catch (error) {
        console.error("Bot API error:", error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return { status };
}
