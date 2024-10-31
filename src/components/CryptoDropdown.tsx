import { Select, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { useCryptocurrencies } from '../hooks/useCryptocurrencies';
import axios from '../axiosConfig';

const { Option } = Select;

interface Crypto {
  id: string;
  name: string;
  symbol: string;
}

interface Props {
  onChange: (value: string) => void;
  value?: string;
}

export function CryptoDropdown({ onChange, value }: Props) {
  const cryptos = useCryptocurrencies();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/favorite').then(response => {
      setFavorites(response.data.map((item: any) => item.cryptoSymbol));
    });
  }, []);

  const handleFavoriteChange = (cryptoId: string, checked: boolean) => {
    if (checked) {
      axios.post('/favorite', { cryptoSymbol: cryptoId }).then(() => {
        setFavorites([...favorites, cryptoId]);
      });
    } else {
      axios.delete('/favorite', { data: { cryptoSymbol: cryptoId } }).then(() => {
        setFavorites(favorites.filter(id => id !== cryptoId));
      });
    }
  };

  const renderOption = (crypto: Crypto) => (
    <Option key={crypto.id} value={crypto.id}>
      <Checkbox
        checked={favorites.includes(crypto.id)}
        onChange={e => handleFavoriteChange(crypto.id, e.target.checked)}
      />
      {crypto.name} ({crypto.symbol.toUpperCase()})
    </Option>
  );

  return (
    <Select
      showSearch
      placeholder="Selecione a criptomoeda"
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      style={{ minWidth: 200 }}
    >
      {cryptos.map(renderOption)}
    </Select>
  );
}
