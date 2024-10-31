import { useState, useEffect } from 'react';
import axios from '../axiosConfig';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
}

export function useCryptocurrencies() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  useEffect(() => {
    axios.get('/cryptocurrencies').then(response => {
      setCryptos(response.data);
    });
  }, []);

  return cryptos;
}
