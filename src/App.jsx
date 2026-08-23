import { lazy, Suspense } from 'react';
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
import { QuoteProvider } from './context/QuoteContext.jsx';
import { LEGAL_ROUTE, ROUTES } from './data/site.js';

/**
 * Le panel d'administration est inclus par défaut.
 *
 * Il l'était autrefois sur demande seulement : l'authentification était côté
 * client et son mot de passe se lisait dans le JavaScript servi aux visiteurs.
 * Ce n'est plus le cas — le serveur vérifie un condensé scrypt et le panel ne
 * contient aucun secret. L'exclure ne protégeait donc plus rien, et faisait
 * disparaître `/admin` en silence dès qu'un déploiement oubliait la variable.
 *
 * `VITE_ENABLE_ADMIN=false` reste possible pour produire un build strictement
 * public, sans le code du panel.
 */
const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN !== 'false';

const AdminRoutes = ADMIN_ENABLED ? lazy(() => import('./admin/AdminRoutes.jsx')) : null;

/** Site public : header, contenu, pied de page et actions flottantes. */
function PublicLayout({ children }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]
          focus:rounded-md focus:bg-accent focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-accent-on"
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

function PublicRoutes() {
  return (
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QuoteProvider>
        <ScrollToTop />

        <Routes>
          {ADMIN_ENABLED ? (
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={null}>
                  <AdminRoutes />
                </Suspense>
              }
            />
          ) : null}

          <Route path="*" element={<PublicRoutes />} />
        </Routes>
      </QuoteProvider>
    </BrowserRouter>
  );
}
