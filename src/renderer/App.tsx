import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import MainBotPage from './pages/MainBotPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainBotPage />} />
          <Route path="/account-settings" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
