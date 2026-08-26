import CarVisual from './CarVisual.jsx';
import GaleriePhotos from './GaleriePhotos.jsx';

/**
 * Galerie de photos d'une annonce.
 *
 * Toute la mécanique est dans `GaleriePhotos` ; il ne reste ici que ce qui est
 * propre à un véhicule : la légende et l'illustration de repli.
 *
 * Sans photo, cette illustration reste affichée : l'annonce tient debout avant
 * même la séance photo.
 */
export default function GalerieVehicule({ vehicle, className = '', dimmed = false }) {
  const nom = `${vehicle.brand} ${vehicle.model}`;

  return (
    <GaleriePhotos
      photos={vehicle.photos ?? []}
      coverIndex={vehicle.coverIndex ?? 0}
      legende={`${nom} — ${vehicle.trim}, à vendre à Brumath`}
      label={`Photos — ${nom}`}
      className={className}
      dimmed={dimmed}
      repli={
        <CarVisual
          scene="polish"
          variant="after"
          palette={vehicle.palette}
          body={vehicle.body}
          className={className}
          title={nom}
        />
      }
    />
  );
}
