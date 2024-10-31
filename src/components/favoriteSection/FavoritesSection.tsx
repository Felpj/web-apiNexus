// src/components/favoriteSection/FavoritesSection.tsx

import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, notification } from 'antd';
import axios from '../../axiosConfig';
import { CryptoDropdown } from '../CryptoDropdown';
import { useFavorites } from '../../hooks/useFavorites';
import './FavoritesSection.css';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
}

export const FavoritesSection: React.FC = () => {
  const { favorites, loading, addFavorite, removeFavorite, removing } = useFavorites();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [favoriteCryptos, setFavoriteCryptos] = useState<Crypto[]>([]);
  const [loadingCryptos, setLoadingCryptos] = useState<boolean>(true);

  useEffect(() => {
    // Buscar a lista de criptomoedas ao montar o componente
    axios
      .get('/cryptocurrencies')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCryptos(response.data);
        } else {
          throw new Error('Formato de dados inesperado.');
        }
        setLoadingCryptos(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar criptomoedas:', error);
        notification.error({
          message: 'Erro',
          description: 'Não foi possível carregar as criptomoedas.',
          placement: 'topRight',
        });
        setLoadingCryptos(false);
      });
  }, []);

  // Atualiza a lista de criptomoedas favoritadas quando `favorites` ou `cryptos` mudar
  useEffect(() => {
    const updatedFavoriteCryptos = cryptos.filter((crypto) =>
      favorites.includes(crypto.name.toUpperCase())
    );
    setFavoriteCryptos(updatedFavoriteCryptos);
  }, [favorites, cryptos]);

  // Define as colunas da tabela de favoritos
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Símbolo',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string) => symbol.toUpperCase(),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Crypto) => (
        <Button
          type="link"
          danger
          onClick={() => removeFavorite(record.name.toUpperCase())}
          loading={removing[record.name.toUpperCase()]}
        >
          Remover
        </Button>
      ),
    },
  ];

  // Se estiver carregando, exibe um spinner
  if (loading || loadingCryptos) {
    return (
      <div className="favorites-section-container">
        <Spin tip="Carregando favoritos..." />
      </div>
    );
  }

  return (
    <div className="favorites-section-container">
      {/* Campo para adicionar criptomoedas aos favoritos */}
      <CryptoDropdown onChange={addFavorite} value={undefined} />

      {/* Se não houver favoritos, exibe uma mensagem informativa */}
      {favoriteCryptos.length === 0 ? (
        <Alert
          message="Nenhuma criptomoeda favoritada."
          type="info"
          showIcon
          className="no-favorites-alert"
        />
      ) : (
        /* Tabela de Criptomoedas Favoritadas */
        <Table
          dataSource={favoriteCryptos.map((crypto) => ({
            key: crypto.symbol,
            ...crypto,
          }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          className="favorites-table"
          title={() => 'Criptomoedas Favoritadas'}
        />
      )}
    </div>
  );
};
