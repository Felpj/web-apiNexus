import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import axios from '../axiosConfig';

interface ConversionHistory {
  id: number;
  userId: number;
  cryptoCurrency: string;
  amount: number;
  convertedValueBRL: number;
  convertedValueUSD: number;
  conversionDate: string; // ISO string
}

interface HistoryData {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  records: ConversionHistory[];
}

interface Props {
  refresh: boolean; // Propriedade para indicar a atualização
}

export function ConversionHistoryTable({ refresh }: Props) {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; // Limite fixo de 10 registros por página

  const fetchHistory = (page: number) => {
    setLoading(true);
    axios.get('/conversion/history', {
      params: {
        page,
        limit: pageSize,
      },
    })
      .then(response => {
        setHistoryData(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar histórico de conversões:', error);
        setError('Não foi possível carregar o histórico de conversões.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage, refresh]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  const columns = [
    {
      title: 'Criptomoeda',
      dataIndex: 'cryptoCurrency',
      key: 'cryptoCurrency',
      render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: 'Quantidade',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => (value !== undefined ? value.toFixed(4) : '-'),
    },
    {
      title: 'Valor em BRL',
      dataIndex: 'convertedValueBRL',
      key: 'convertedValueBRL',
      render: (value: number) => (value !== undefined ? `R$ ${value.toFixed(2)}` : '-'),
    },
    {
      title: 'Valor em USD',
      dataIndex: 'convertedValueUSD',
      key: 'convertedValueUSD',
      render: (value: number) => (value !== undefined ? `$ ${value.toFixed(2)}` : '-'),
    },
    {
      title: 'Data da Conversão',
      dataIndex: 'conversionDate',
      key: 'conversionDate',
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
      sorter: (a: ConversionHistory, b: ConversionHistory) => new Date(a.conversionDate).getTime() - new Date(b.conversionDate).getTime(),
    },
  ];

  if (loading) {
    return <Spin tip="Carregando histórico de conversões..." />;
  }

  if (error) {
    return <Alert message="Erro" description={error} type="error" showIcon />;
  }

  if (historyData && historyData.records.length === 0) {
    return <Alert message="Nenhuma conversão encontrada." type="info" showIcon />;
  }

  return (
    <Table
      dataSource={historyData?.records}
      columns={columns}
      rowKey="id"
      pagination={{
        current: historyData?.currentPage,
        pageSize: pageSize,
        total: historyData?.totalRecords,
        showSizeChanger: false, // Desativa o seletor de tamanho da página
      }}
      onChange={handleTableChange}
      bordered
      title={() => 'Histórico de Conversões'}
    />
  );
}
