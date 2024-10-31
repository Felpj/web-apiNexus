import { Button } from 'antd';

interface Props {
  onClick: () => void;
}

export function ConvertButton({ onClick }: Props) {
  return (
    <Button type="primary" onClick={onClick}>
      Converter
    </Button>
  );
}
