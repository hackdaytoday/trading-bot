const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MetaApi = require('metaapi.cloud-sdk').default;
const path = require('path');

// Wczytaj zmienne środowiskowe
const envPath = path.resolve(__dirname, '../.env');
console.log('Ścieżka do pliku .env:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Błąd wczytywania pliku .env:', result.error);
} else {
  console.log('Plik .env wczytany pomyślnie');
}

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Przechowuj połączenia klientów
const connections = new Map();

// Endpoint do łączenia z kontem MT5
app.post('/api/connect', async (req, res) => {
  try {
    const { server, login, password } = req.body;
    
    if (!server || !login || !password) {
      return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    console.log('Próba połączenia z kontem MT5:', { server, login });
    console.log('Token API:', process.env.META_API_TOKEN ? 'Jest ustawiony' : 'Brak');

    if (!process.env.META_API_TOKEN) {
      console.error('Brak tokenu API w zmiennych środowiskowych!');
      return res.status(500).json({ error: 'Brak tokenu API' });
    }

    // Utwórz instancję MetaApi
    const api = new MetaApi(process.env.META_API_TOKEN);

    try {
      // Sprawdź, czy możemy pobrać konta (test autoryzacji)
      console.log('Sprawdzanie autoryzacji...');
      const accounts = await api.metatraderAccountApi.getAccounts();
      console.log('Autoryzacja udana, znaleziono kont:', accounts.length);

      // Sprawdź, czy konto już istnieje
      const existingAccount = accounts.find(a => 
        a.login === login.toString() && a.server.toLowerCase() === server.toLowerCase()
      );

      let account;
      if (existingAccount) {
        console.log('Znaleziono istniejące konto');
        account = existingAccount;
      } else {
        // Utwórz nowe konto
        console.log('Tworzenie nowego konta...');
        account = await api.metatraderAccountApi.createAccount({
          name: `${login}@${server}`,
          type: 'cloud-g2',
          login: login.toString(),
          password: password,
          server: server,
          platform: 'mt5',
          magic: 123456
        });
      }

      // Poczekaj na wdrożenie konta
      console.log('Czekam na wdrożenie konta...');
      await account.waitDeployed();
      console.log('Konto zostało wdrożone');

      // Utwórz połączenie RPC
      console.log('Tworzenie połączenia RPC...');
      const connection = account.getRPCConnection();
      
      // Połącz
      console.log('Łączenie...');
      await connection.connect();
      console.log('Połączono pomyślnie');

      // Pobierz informacje o koncie
      console.log('Pobieranie informacji o koncie...');
      const accountInfo = await connection.getAccountInformation();
      console.log('Informacje o koncie:', accountInfo);

      // Wygeneruj unikalny identyfikator połączenia
      const connectionId = Math.random().toString(36).substring(7);
      
      // Zapisz połączenie
      connections.set(connectionId, {
        connection,
        accountInfo
      });

      res.json({
        connectionId,
        accountInfo: {
          balance: accountInfo.balance,
          equity: accountInfo.equity,
          margin: accountInfo.margin,
          freeMargin: accountInfo.freeMargin,
          leverage: accountInfo.leverage,
          currency: accountInfo.currency
        }
      });
    } catch (error) {
      console.error('Błąd podczas konfiguracji konta:', error);
      res.status(500).json({ error: 'Nie udało się skonfigurować konta: ' + error.message });
    }
  } catch (error) {
    console.error('Błąd podczas łączenia:', error);
    res.status(500).json({ error: 'Nie udało się połączyć: ' + error.message });
  }
});

// Endpoint do pobierania informacji o koncie
app.get('/api/account/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connectionData = connections.get(connectionId);

    if (!connectionData) {
      return res.status(404).json({ error: 'Nie znaleziono połączenia' });
    }

    const { connection } = connectionData;
    const accountInfo = await connection.getAccountInformation();

    res.json({
      balance: accountInfo.balance,
      equity: accountInfo.equity,
      margin: accountInfo.margin,
      freeMargin: accountInfo.freeMargin,
      leverage: accountInfo.leverage,
      currency: accountInfo.currency
    });

  } catch (error) {
    console.error('Błąd podczas pobierania informacji o koncie:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do pobierania pozycji
app.get('/api/positions/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connectionData = connections.get(connectionId);

    if (!connectionData) {
      return res.status(404).json({ error: 'Nie znaleziono połączenia' });
    }

    const { connection } = connectionData;
    const positions = await connection.getPositions();

    res.json(positions.map(position => ({
      id: position.id,
      symbol: position.symbol,
      type: position.type,
      volume: position.volume,
      openPrice: position.openPrice,
      stopLoss: position.stopLoss,
      takeProfit: position.takeProfit,
      profit: position.profit
    })));

  } catch (error) {
    console.error('Błąd podczas pobierania pozycji:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do sprawdzania stanu połączenia
app.get('/api/connection/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connectionData = connections.get(connectionId);

    if (!connectionData) {
      return res.status(404).json({ error: 'Połączenie nie istnieje' });
    }

    try {
      // Sprawdź, czy połączenie jest aktywne
      const accountInfo = await connectionData.connection.getAccountInformation();
      res.json({ status: 'connected', accountInfo });
    } catch (error) {
      console.error('Błąd podczas sprawdzania połączenia:', error);
      connections.delete(connectionId);
      res.status(404).json({ error: 'Połączenie nieaktywne' });
    }
  } catch (error) {
    console.error('Błąd podczas sprawdzania stanu połączenia:', error);
    res.status(500).json({ error: 'Nie udało się sprawdzić stanu połączenia' });
  }
});

// Endpoint do rozłączania
app.post('/api/disconnect/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const connectionData = connections.get(connectionId);

    if (!connectionData) {
      return res.status(404).json({ error: 'Połączenie nie istnieje' });
    }

    try {
      await connectionData.connection.disconnect();
    } catch (error) {
      console.error('Błąd podczas rozłączania:', error);
    }

    connections.delete(connectionId);
    res.json({ status: 'disconnected' });
  } catch (error) {
    console.error('Błąd podczas rozłączania:', error);
    res.status(500).json({ error: 'Nie udało się rozłączyć' });
  }
});

// Obsługa błędów
app.use((err, req, res, next) => {
  console.error('Nieobsłużony błąd:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ error: 'Wystąpił błąd serwera' });
});

// Uruchom serwer
app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
  console.log('Token API:', process.env.META_API_TOKEN ? 'Ustawiony' : 'Brak');
});
