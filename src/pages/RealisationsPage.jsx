import PageHeader from '../components/layout/PageHeader.jsx';
import Gallery from '../components/sections/Gallery.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function RealisationsPage() {
  usePageMeta({
    title: 'Réalisations & avis clients | Teintérior',
    description:
      'Galerie des véhicules passés à l’atelier — detailing, rétrofit CarPlay, dépôt-vente — et avis clients vérifiés notés 4,9/5.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Réalisations"
        title="Ce qui sort"
        highlight="de notre atelier"
        description="Un aperçu des véhicules passés entre nos mains ces derniers mois, filtrable par métier, et les retours des clients qui nous ont confié leur voiture."
      />
      <Gallery hideHeading />
      <Testimonials />
      <CtaBand
        title="Votre voiture mérite le même traitement"
        text="Chaque véhicule photographié ici est reparti avec un compte rendu détaillé. Le vôtre peut être le prochain."
        primaryLabel="Réserver un créneau"
      />
    </>
  );
}
