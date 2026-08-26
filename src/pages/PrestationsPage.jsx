import PageHeader from '../components/layout/PageHeader.jsx';
import Detailing from '../components/sections/Detailing.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function PrestationsPage() {
  usePageMeta({
    title: 'Lavage, detailing et remise en état — Tarifs | Teintérior',
    description:
      'Lavage complet, nettoyage intérieur approfondi et détailing complet : cuir, plastiques et odeurs. Tarifs dès 49 € et comparatif avant / après.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Prestations"
        title="Esthétique automobile"
        highlight="jusqu’au moindre détail"
        description="Trois formules lisibles, des tarifs annoncés avant l’intervention et un protocole détaillé étape par étape. Un seul véhicule à la fois dans l’atelier, photographié avant et après passage."
      />
      <Detailing hideHeading />
      <CtaBand
        title="Pas sûr de la formule à choisir ?"
        text="Décrivez-nous l’état de votre véhicule et l’usage que vous en faites : nous vous orientons vers la prestation strictement nécessaire, jamais davantage."
        primaryLabel="Demander conseil"
      />
    </>
  );
}
