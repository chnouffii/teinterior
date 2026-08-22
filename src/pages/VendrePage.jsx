import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Sourcing from '../components/sections/Sourcing.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import Button from '../components/ui/Button.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { ROUTES } from '../data/site.js';

export default function VendrePage() {
  usePageMeta({
    title: 'Vendre sa voiture — Dépôt-vente & sourcing | Teintérior',
    description:
      'Confiez-nous la vente de votre véhicule : estimation gratuite, préparation esthétique offerte, shooting photo professionnel, gestion des visites et transaction sécurisée.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Vendre sa voiture"
        title="Confiez-nous"
        highlight="la vente de votre voiture"
        description="Vous n’avez ni le temps ni l’envie de gérer les appels, les visites et les acheteurs peu sérieux ? Nous prenons le véhicule en dépôt, le préparons, le mettons en scène et gérons la transaction jusqu’à la remise des clés."
      >
        <Button as={Link} to={ROUTES.vehicules} variant="secondary" size="md" iconRight={ArrowRight}>
          Voir les véhicules déjà en vente
        </Button>
      </PageHeader>
      <Sourcing hideHeading />
      <CtaBand
        title="Vous cherchez un véhicule précis ?"
        text="Donnez-nous votre cahier des charges — budget, options, kilométrage maximum. Nous cherchons, expertisons sur place et livrons le véhicule préparé."
        primaryLabel="Lancer une recherche"
      />
    </>
  );
}
