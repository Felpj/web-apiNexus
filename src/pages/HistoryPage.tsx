import { ConversionHistoryTable } from '../components/ConversionHistoryTable';
import { Layout } from 'antd';

const { Content } = Layout;

export function HistoryPage() {
  return (
    <Content style={{ padding: '24px', backgroundColor: '#0f172a' }}>
      <ConversionHistoryTable />
    </Content>
  );
}
