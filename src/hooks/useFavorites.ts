// src/hooks/useFavorites.ts

import { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { notification } from 'antd';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [removing, setRemoving] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Buscar os favoritos do usuário ao montar o hook
    axios
      .get('/favorite')
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setFavorites(response.data.data.map((symbol: string) => symbol.toUpperCase()));
        } else {
          throw new Error('Formato de dados inesperado.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar favoritos:', error);
        notification.error({
          message: 'Erro',
          description: 'Não foi possível carregar os favoritos.',
          placement: 'topRight',
        });
        setLoading(false);
      });
  }, []);

  const addFavorite = (cryptoSymbol: string) => {
    const symbolUpper = cryptoSymbol.toUpperCase();
    if (favorites.includes(symbolUpper)) {
      notification.info({
        message: 'Já Favoritado',
        description: `${symbolUpper} já está nos seus favoritos.`,
        placement: 'topRight',
      });
      return;
    }

    axios
      .post('/favorite', { cryptoSymbol: symbolUpper })
      .then(() => {
        setFavorites((prev) => [...prev, symbolUpper]);
        notification.success({
          message: 'Favorito Adicionado',
          description: `${symbolUpper} foi adicionado aos seus favoritos.`,
          placement: 'topRight',
        });
      })
      .catch((error) => {
        console.error('Erro ao adicionar favorito:', error);
        notification.error({
          message: 'Erro',
          description: error.response?.data?.error || 'Não foi possível adicionar o favorito.',
          placement: 'topRight',
        });
      });
  };

  const removeFavorite = (cryptoSymbol: string) => {
    const symbolUpper = cryptoSymbol.toUpperCase();
    setRemoving((prev) => ({ ...prev, [symbolUpper]: true }));

    axios
      .delete('/favorite', { data: { cryptoSymbol: symbolUpper } })
      .then(() => {
        setFavorites((prev) => prev.filter((symbol) => symbol !== symbolUpper));
        notification.success({
          message: 'Favorito Removido',
          description: `${symbolUpper} foi removido dos seus favoritos.`,
          placement: 'topRight',
        });
      })
      .catch((error) => {
        console.error('Erro ao remover favorito:', error);
        notification.error({
          message: 'Erro',
          description: error.response?.data?.error || 'Não foi possível remover o favorito.',
          placement: 'topRight',
        });
      })
      .finally(() => {
        setRemoving((prev) => ({ ...prev, [symbolUpper]: false }));
      });
  };

  return { favorites, loading, addFavorite, removeFavorite, removing };
}
