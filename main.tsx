import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DashboardHome from './components/DashboardHome';
import GuardianRoom from './components/GuardianRoom';
import Layout from './components/Layout';

export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="writers-room" element={<GuardianRoom project={null} onBack={() => window.history.back()} />} />
          {/* Other routes can be added as needed with proper data providers */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
