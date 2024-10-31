// src/components/favoriteSection/FavoriteCryptosTable.tsx

import React from 'react';
import { Table, Button } from 'antd';

interface Props {
  favoriteCryptos: Crypto[];
  handleRemoveFavorite: (symbol: string) => void;
  removing: { [key: string]: boolean };
}

export interface Crypto {
  name: string;       // Nome da criptomoeda
  symbol: string;     // Símbolo da criptomoeda
  price?: number;     // Preço da criptomoeda (opcional)
  marketCap?: number; // Valor de mercado da criptomoeda (opcional)
  volume24h?: number; // Volume de negociação nas últimas 24h (opcional)
}

export const FavoriteCryptosTable: React.FC<Props> = ({
  favoriteCryptos,
  handleRemoveFavorite,
  removing,
}) => {
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
          onClick={() => handleRemoveFavorite(record.symbol)}
          loading={removing[record.symbol.toUpperCase()]}
        >
          Remover
        </Button>
      ),
    },
  ];

  return (
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
  );
};
