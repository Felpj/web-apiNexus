// src/pages/HomePage.tsx
import { useState } from 'react';
import { Layout, Menu, Button, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css'; // Importa o arquivo CSS
import { useAuth } from '../../hooks/useAuth';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import { CryptoDropdown } from '../../components/CryptoDropdown';
import { AmountInput } from '../../components/AmountInput';
import { ConvertButton } from '../../components/ConvertButton';
import { ConversionHistoryTable } from '../../components/ConversionHistoryTable';
import { FavoritesSection } from '../../components/favoriteSection/FavoritesSection';

const { Header, Content, Sider } = Layout;

export function HomePage() {
  const [selectedCrypto, setSelectedCrypto] = useState<string | undefined>();
  const [amount, setAmount] = useState<number>(0);
  const [conversionResult, setConversionResult] = useState<{ convertedValueBRL: number; convertedValueUSD: number } | null>(null);
  const [favoriteCryptos, setFavoriteCryptos] = useState<string[]>([]);
  const [refreshHistory, setRefreshHistory] = useState<boolean>(false);

  const { removeToken } = useAuth();
  const navigate = useNavigate();
  const axiosAuth = useAxiosAuth();

  const handleAmountChange = (value: number | null) => {
    setAmount(value ?? 0);
  };

  const handleConvert = () => {
    if (selectedCrypto && amount > 0) {
      console.log('Enviando para conversão:', { cryptoCurrency: selectedCrypto, amount });
      axiosAuth.post('/conversion/flow', { cryptoCurrency: selectedCrypto, amount })
        .then(response => {
          setConversionResult(response.data.data);
          notification.success({
            message: 'Conversão Realizada',
            description: `Você converteu ${amount} ${selectedCrypto}.`,
            placement: 'topRight',
          });
          setRefreshHistory(prev => !prev);
        })
        .catch(error => {
          console.error('Erro na conversão:', error);
          notification.error({
            message: 'Erro na Conversão',
            description: error.response?.data.error || error.message,
            placement: 'topRight',
          });
        });
    } else {
      notification.warning({
        message: 'Atenção',
        description: 'Selecione uma criptomoeda e insira uma quantidade válida.',
        placement: 'topRight',
      });
    }
  };

  const handleLogout = () => {
    removeToken();
    notification.success({
      message: 'Logout Bem-Sucedido',
      description: 'Você saiu da sua conta.',
      placement: 'topRight',
    });
    navigate('/');
  };

  // Função para rolar até uma seção específica
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    {
      key: '1',
      label: <Link to="/home">Conversão</Link>,
      onClick: () => scrollToSection('conversion-section'),
    },
    {
      key: '2',
      label: <Link to="/home/history">Histórico</Link>,
      onClick: () => scrollToSection('history-section'),
    },
    {
      key: '3',
      label: <Link to="/home/favorites">Favoritos</Link>,
      onClick: () => scrollToSection('favorites-section'),
    },
  ];

  return (

    
    <Layout className="homepage-layout">
      {/* Cabeçalho */}
      <Header className="homepage-header">
        <h2>Crypto Converter</h2>
        <Button
          type="primary"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </Header>

      <Layout>
        {/* Sidebar de Navegação */}
        <Sider
          collapsible
          breakpoint="lg"
          collapsedWidth="0"
          width={200}
          className="homepage-sider"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            className="homepage-menu"
            items={menuItems}
          />
        </Sider>

        {/* Conteúdo Principal */}
        <Layout className="homepage-content">
          <Content className="homepage-content-inner">
            {/* Formulário de Conversão */}
            <div className="conversion-form">
              <CryptoDropdown onChange={setSelectedCrypto} value={selectedCrypto} />
              <AmountInput onChange={handleAmountChange} value={amount} />
              <ConvertButton onClick={handleConvert} />
            </div>

            {/* Resultados da Conversão */}
            {conversionResult && (
              <div className="conversion-result">
                <p><strong>Valor em BRL:</strong> R$ {conversionResult.convertedValueBRL.toFixed(2)}</p>
                <p><strong>Valor em USD:</strong> $ {conversionResult.convertedValueUSD.toFixed(2)}</p>
              </div>
            )}

            {/* Tabela de Histórico de Conversões */}
            <div id='' className="history-table-container">
              <ConversionHistoryTable refresh={refreshHistory} />
            </div>

            {/* Seção de Favoritos */}
            <div id="favorites-section" className="favorites-section">
              <h2>Favoritos</h2>
              <FavoritesSection />
            </div>       
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
