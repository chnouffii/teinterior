import Hero from '../components/sections/Hero.jsx';
import PoleOverview from '../components/sections/PoleOverview.jsx';
import Showroom from '../components/sections/Showroom.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function HomePage() {
  usePageMeta({
    title: 'Teintérior — Detailing, rétrofit CarPlay et vente de véhicules · Toulouse',
    description:
      'Atelier automobile à Toulouse : correction de peinture, céramique, teintage, rétrofit CarPlay et Android Auto sur écran d’origine, dépôt-vente et sourcing. Devis détaillé sous 24 h.',
  });

  return (
    <>
      <Hero />
      <PoleOverview />
      <Showroom hideHeading={false} limit={3} showFilters={false} />
      <Testimonials limit={3} showAllLink />
      <CtaBand />
    </>
  );
}
