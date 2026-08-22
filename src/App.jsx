import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import MobileCallBar from './components/layout/MobileCallBar.jsx';
import BackToTop from './components/layout/BackToTop.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import PrestationsPage from './pages/PrestationsPage.jsx';
import RetrofitPage from './pages/RetrofitPage.jsx';
import VendrePage from './pages/VendrePage.jsx';
import VehiculesPage from './pages/VehiculesPage.jsx';
import VehiculeDetailPage from './pages/VehiculeDetailPage.jsx';
import RealisationsPage from './pages/RealisationsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AdminLayout from './admin/components/AdminLayout';
import RequireAuth from './admin/RequireAuth';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import AdminVehiclesPage from './admin/pages/VehiclesPage';
import ServicesPage from './admin/pages/ServicesPage';
import ContentPage from './admin/pages/ContentPage';
import LeadsPage from './admin/pages/LeadsPage';
import { QuoteProvider } from './context/QuoteContext.jsx';
import { LEGAL_ROUTE, ROUTES } from './data/site.js';

/** Site public : header, contenu, pied de page et actions flottantes. */
function PublicLayout({ children }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]
          focus:rounded-2xl focus:bg-accent focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-accent-on"
      >
        Aller au contenu principal
      </a>
      <Header />
      <main id="contenu" className="pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <MobileCallBar />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <ScrollToTop />

        <Routes>
          {/* Administration — hors layout public */}
          <Route path="/admin/connexion" element={<LoginPage />} />
          <Route
            path="/admin"
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

          {/* Site public */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path={ROUTES.home} element={<HomePage />} />
                  <Route path={ROUTES.prestations} element={<PrestationsPage />} />
                  <Route path={ROUTES.retrofit} element={<RetrofitPage />} />
                  <Route path={ROUTES.vendre} element={<VendrePage />} />
                  <Route path={ROUTES.vehicules} element={<VehiculesPage />} />
                  <Route path={`${ROUTES.vehicules}/:vehicleId`} element={<VehiculeDetailPage />} />
                  <Route path="/showroom" element={<Navigate to={ROUTES.vehicules} replace />} />
                  <Route path={ROUTES.realisations} element={<RealisationsPage />} />
                  <Route path={ROUTES.contact} element={<ContactPage />} />
                  <Route path={LEGAL_ROUTE} element={<LegalPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PublicLayout>
            }
          />
        </Routes>
      </QuoteProvider>
    </BrowserRouter>
  );
}
