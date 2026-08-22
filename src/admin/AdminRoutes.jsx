import { Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import RequireAuth from './RequireAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminVehiclesPage from './pages/VehiclesPage';
import ServicesPage from './pages/ServicesPage';
import ContentPage from './pages/ContentPage';
import LeadsPage from './pages/LeadsPage';
import AccueilPage from './pages/AccueilPage';
import RetrofitAdminPage from './pages/RetrofitPage';
import VendreAdminPage from './pages/VendrePage';
import RealisationsAdminPage from './pages/RealisationsPage';
import LegalAdminPage from './pages/LegalAdminPage';
import AvantApresAdminPage from './pages/AvantApresPage';

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
        <Route path="accueil" element={<AccueilPage />} />
        <Route path="retrofit" element={<RetrofitAdminPage />} />
        <Route path="vendre" element={<VendreAdminPage />} />
        <Route path="realisations" element={<RealisationsAdminPage />} />
        <Route path="avant-apres" element={<AvantApresAdminPage />} />
        <Route path="legal" element={<LegalAdminPage />} />
      </Route>
    </Routes>
  );
}
