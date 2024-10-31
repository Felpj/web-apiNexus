import { useState } from 'react';
import { CryptoDropdown } from '../components/CryptoDropdown';
import { AmountInput } from '../components/AmountInput';
import { ConvertButton } from '../components/ConvertButton';
import { ConversionHistoryTable } from '../components/ConversionHistoryTable';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import { notification } from 'antd';

export function DashboardPage() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [conversionResult, setConversionResult] = useState<{ convertedValueBRL: number; convertedValueUSD: number } | null>(null);

  const axiosAuth = useAxiosAuth();

  const handleAmountChange = (value: number | null) => {
    setAmount(value ?? 0);
  };

  const handleConvert = () => {
    if (selectedCrypto && amount > 0) {
      axiosAuth
        .post('/conversion/flow', { cryptoCurrency: selectedCrypto, amount })
        .then(response => {
          setConversionResult(response.data.data);
          notification.success({
            message: 'Conversão realizada com sucesso',
            description: `Você converteu ${amount} ${selectedCrypto}`,
            placement: 'topRight',
          });
        })
        .catch(error => {
          notification.error({
            message: 'Erro ao realizar a conversão',
            description: error.response?.data.error || error.message,
            placement: 'topRight',
          });
        });
    } else {
      notification.warning({
        message: 'Atenção',
        description: 'Selecione uma criptomoeda e insira uma quantidade válida',
        placement: 'topRight',
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <CryptoDropdown onChange={setSelectedCrypto} value={selectedCrypto} />
        <AmountInput onChange={handleAmountChange} value={amount} />
        <ConvertButton onClick={handleConvert} />
      </div>
      {conversionResult && (
        <div style={{ marginBottom: '24px', color: '#ffffff' }}>
          <p>Valor em BRL: {conversionResult.convertedValueBRL.toFixed(2)}</p>
          <p>Valor em USD: {conversionResult.convertedValueUSD.toFixed(2)}</p>
        </div>
      )}
      <ConversionHistoryTable refresh={refreshHistory}/>
    </div>
  );
}
