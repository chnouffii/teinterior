import Hero from '../components/sections/Hero.jsx';
import PoleOverview from '../components/sections/PoleOverview.jsx';
import Showroom from '../components/sections/Showroom.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import useSection from '../hooks/useSection.js';

export default function HomePage() {
  // Le garde est ici et non dans le composant : le même Showroom sert la page
  // « Véhicules à vendre », qui doit rester en place quoi qu'il arrive.
  const apercuVehicules = useSection('showroomAccueil');

  usePageMeta({
    title: 'Teintérior — Detailing, CarPlay et vente auto à Brumath',
    description:
      'Atelier automobile à Brumath, près de Strasbourg : detailing, céramique, teintage, rétrofit CarPlay sur écran d’origine et dépôt-vente. Devis sous 24 h.',
  });

  return (
    <>
      <Hero />
      <PoleOverview />
      {apercuVehicules ? <Showroom hideHeading={false} limit={3} showFilters={false} /> : null}
      <Testimonials limit={3} showAllLink />
      <CtaBand />
    </>
  );
}
