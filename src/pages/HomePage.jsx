import Hero from '../components/sections/Hero.jsx';
import PoleOverview from '../components/sections/PoleOverview.jsx';
import Showroom from '../components/sections/Showroom.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function HomePage() {
  usePageMeta({
    title: 'Teintérior — Detailing premium, rétrofit CarPlay & vente automobile',
    description:
      'Atelier d’esthétique automobile à Toulouse : detailing, polissage, céramique, teintage de vitres, rétrofit CarPlay / Android Auto et dépôt-vente de véhicules. Devis sous 24 h.',
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
