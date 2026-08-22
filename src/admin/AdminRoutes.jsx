import { Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import RequireAuth from './RequireAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminVehiclesPage from './pages/VehiclesPage';
import ServicesPage from './pages/ServicesPage';
import ContentPage from './pages/ContentPage';
import LeadsPage from './pages/LeadsPage';

/**
 * Panel d'administration, monté sous `/admin/*`.
 *
 * Ce module n'est chargé que lorsque `VITE_ENABLE_ADMIN=true` : il est importé
 * dynamiquement depuis `App.jsx` pour rester hors du bundle public.
 */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="connexion" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="vehicules" element={<AdminVehiclesPage />} />
        <Route path="prestations" element={<ServicesPage />} />
        <Route path="contenu" element={<ContentPage />} />
        <Route path="leads" element={<LeadsPage />} />
      </Route>
    </Routes>
  );
}
