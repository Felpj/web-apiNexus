// src/pages/FavoritePage.tsx

import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import { CryptoDropdown } from '../components/CryptoDropdown';
import { FavoriteCryptosTable } from '../components/favoriteSection/FavoriteCryptosTable';
import axios from 'axios'; // Certifique-se de ter o axios instalado

const { Content } = Layout;


export interface Crypto {
  name: string;       // Nome da criptomoeda
  symbol: string;     // Símbolo da criptomoeda
  price?: number;     // Preço da criptomoeda (opcional)
  marketCap?: number; // Valor de mercado da criptomoeda (opcional)
  volume24h?: number; // Volume de negociação nas últimas 24h (opcional)
}

export function FavoritePage() {
  const [selectedCrypto, setSelectedCrypto] = useState<string | undefined>();
  const [favoriteCryptos, setFavoriteCryptos] = useState<Crypto[]>([]);
  const [removing, setRemoving] = useState<{ [key: string]: boolean }>({});
  const [  ,setLoading] = useState<boolean>(false); // Estado de carregamento

  

  // Função para buscar as criptomoedas favoritas da API
  const fetchFavoriteCryptos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/favorites'); // Substitua pela URL correta da sua API
      const favoriteSymbols: string[] = response.data.data;

      // Agora, para cada símbolo, obtenha os detalhes completos da criptomoeda
      // Supondo que você tenha uma API que retorna detalhes da criptomoeda por símbolo
      const cryptoDetailsPromises = favoriteSymbols.map(async (symbol) => {
        const cryptoResponse = await axios.get(`/api/cryptos/${symbol}`); // Substitua pela URL correta
        return cryptoResponse.data as Crypto;
      });

      const cryptoDetails = await Promise.all(cryptoDetailsPromises);
      setFavoriteCryptos(cryptoDetails);
    } catch (error) {
      console.error('Erro ao buscar criptomoedas favoritas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteCryptos();
  }, []);

  // Função para remover uma criptomoeda favorita
  const handleRemoveFavorite = async (symbol: string) => {
    setRemoving((prev) => ({ ...prev, [symbol]: true }));
    try {
      await axios.delete(`/api/favorites/${symbol}`); // Substitua pela URL correta
      setFavoriteCryptos((prev) => prev.filter((crypto) => crypto.symbol !== symbol));
    } catch (error) {
      console.error('Erro ao remover criptomoeda favorita:', error);
    } finally {
      setRemoving((prev) => ({ ...prev, [symbol]: false }));
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '20px' }}>
        <h2>Gerenciar Favoritos</h2>
        <CryptoDropdown onChange={setSelectedCrypto} value={selectedCrypto} />
        <FavoriteCryptosTable
          favoriteCryptos={favoriteCryptos}
          handleRemoveFavorite={handleRemoveFavorite}
          removing={removing}
        />
      </Content>
    </Layout>
  );
}
