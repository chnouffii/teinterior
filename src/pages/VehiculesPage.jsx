import PageHeader from '../components/layout/PageHeader.jsx';
import Showroom from '../components/sections/Showroom.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { VEHICLES } from '../data/vehicles.js';

export default function VehiculesPage() {
  const available = VEHICLES.filter((vehicle) => vehicle.status === 'disponible').length;

  usePageMeta({
    title: 'Véhicules à vendre — Showroom Teintérior',
    description:
      'Véhicules d’occasion contrôlés, préparés et lustrés par l’atelier Teintérior : kilométrage, énergie, boîte, points forts et réservation d’essai en ligne.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Véhicules à vendre"
        title="Nos véhicules disponibles"
        description={`${available} véhicules immédiatement disponibles, tous passés par notre atelier : contrôle sur 120 points, préparation esthétique complète et reportage photo. Vous achetez une voiture déjà prête à rouler.`}
      />
      <Showroom hideHeading />
      <CtaBand
        title="Aucun de ces véhicules ne correspond ?"
        text="Notre service de sourcing recherche le modèle exact que vous voulez, en France comme à l’étranger, avec expertise indépendante avant tout achat."
        primaryLabel="Décrire ma recherche"
      />
    </>
  );
}
