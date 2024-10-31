import { useState } from 'react';
import { ConversionHistoryTable } from '../components/ConversionHistoryTable';
import { Layout } from 'antd';

const { Content } = Layout;

export function HistoryPage() {
  const [refreshHistory] = useState<boolean>(false);
  return (
    <Content style={{ padding: '24px', backgroundColor: '#0f172a' }}>
      <ConversionHistoryTable refresh={refreshHistory} />
    </Content>
  );
}
