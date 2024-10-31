import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/home/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { FavoritePage } from './pages/FavoritePage';
import { HistoryPage } from './pages/HistoryPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={token ? <HomePage /> : <Navigate to="/" />}>
          <Route index element={<DashboardPage />} />
          <Route path="favorites" element={<FavoritePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
