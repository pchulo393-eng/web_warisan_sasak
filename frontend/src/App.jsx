import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BerandaPage from './pages/BerandaPage';
import HeritagePage from './pages/HeritagePage';
import DetailPage from './pages/DetailPage';
import PetaPage from './pages/PetaPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import HeritageAdminPage from './pages/admin/HeritageAdminPage';
import HeritageFormPage from './pages/admin/HeritageFormPage';
import FotoPage from './pages/admin/FotoPage';

const isAdmin = () => !!localStorage.getItem('admin_token');
const PrivateRoute = ({ children }) => isAdmin() ? children : <Navigate to="/login" />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="/heritage" element={<HeritagePage />} />
        <Route path="/heritage/:id" element={<DetailPage />} />
        <Route path="/peta" element={<PetaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/admin/heritage" element={<PrivateRoute><HeritageAdminPage /></PrivateRoute>} />
        <Route path="/admin/heritage/tambah" element={<PrivateRoute><HeritageFormPage /></PrivateRoute>} />
        <Route path="/admin/heritage/:id/edit" element={<PrivateRoute><HeritageFormPage /></PrivateRoute>} />
        <Route path="/admin/heritage/:id/foto" element={<PrivateRoute><FotoPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
