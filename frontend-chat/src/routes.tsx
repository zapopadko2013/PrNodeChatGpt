import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  MessageOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import ChatPage from './pages/ChatPage';
import HistoryPage from './pages/HistoryPage';

const { Header, Sider, Content } = Layout;

const items = [
  { key: '/', icon: <MessageOutlined />, label: <Link to="/">Чат</Link> },
  { key: '/history', icon: <HistoryOutlined />, label: <Link to="/history">История чата</Link> },
];

function SidebarMenu() {
  const location = useLocation();
  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0 }}
      items={items}
    />
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} className="site-layout-background">
          <SidebarMenu />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}