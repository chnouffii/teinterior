import PageHeader from '../components/layout/PageHeader.jsx';
import Contact from '../components/sections/Contact.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function ContactPage() {
  usePageMeta({
    title: 'Devis & contact — Atelier Teintérior Brumath',
    description:
      'Demandez un devis gratuit : lavage complet, remise en état de l’habitacle, rétrofit CarPlay ou dépôt-vente. Coordonnées, horaires et plan d’accès.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de"
        highlight="votre véhicule"
        description="Un projet de rénovation, une envie de CarPlay ou une voiture à vendre ? Décrivez-nous votre besoin : nous répondons avec un devis détaillé, ligne par ligne, sous 24 h ouvrées."
      />
      <Contact hideHeading />
    </>
  );
}
