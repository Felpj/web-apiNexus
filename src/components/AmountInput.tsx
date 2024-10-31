import { InputNumber } from 'antd';

interface Props {
  onChange: (value: number | null) => void; // Permite o valor null
  value?: number;
}

export function AmountInput({ onChange, value }: Props) {
  return (
    <InputNumber
      min={0}
      value={value}
      onChange={onChange}
      placeholder="Quantidade"
    />
  );
}
