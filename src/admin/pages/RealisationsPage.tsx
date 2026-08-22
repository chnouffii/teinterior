import { Field, TextInput } from '../components/Field';
import { Bloc, ListeEditable } from '../components/Editors';
import { useSiteStore } from '../../store/siteStore';

const CARROSSERIES = 'berline, break, suv, citadine, coupe';
const SCENES = 'polish, tint, interior, screen, sale';

/**
 * Page « Réalisations » : la galerie filtrable, ses filtres, et les avis
 * clients avec la note de synthèse.
 */
export default function RealisationsAdminPage() {
  const gallery = useSiteStore((state) => state.gallery);
  const galleryFilters = useSiteStore((state) => state.galleryFilters);
  const testimonials = useSiteStore((state) => state.testimonials);
  const reviewSummary = useSiteStore((state) => state.reviewSummary);
  const setSection = useSiteStore((state) => state.setSection);
  const patchSection = useSiteStore((state) => state.patchSection);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Réalisations et avis</h1>
        <p className="mt-1 text-xs text-faint">
          La galerie de la page Réalisations, ses filtres, et les témoignages clients.
        </p>
      </header>

      <Bloc
        titre="Filtres de la galerie"
        aide="Les boutons au-dessus de la galerie. L’identifiant doit correspondre à la catégorie saisie sur chaque réalisation."
      >
        <ListeEditable
          items={galleryFilters as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('galleryFilters', suivant as never)}
          titreItem={(item) => String(item.label || 'Filtre')}
          ajoutLabel="Ajouter un filtre"
          nouvelItem={() => ({ id: '', label: '' })}
          champs={[
            { cle: 'id', label: 'Identifiant', largeur: 5, aide: 'sans espace ni accent' },
            { cle: 'label', label: 'Libellé affiché', largeur: 7 },
          ]}
        />
      </Bloc>

      <Bloc
        titre="Galerie"
        aide={`Chaque vignette porte sa scène (${SCENES}) et, pour les scènes de véhicule, sa carrosserie (${CARROSSERIES}).`}
      >
        <ListeEditable
          items={gallery as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('gallery', suivant as never)}
          titreItem={(item) => String(item.title || 'Nouvelle réalisation')}
          ajoutLabel="Ajouter une réalisation"
          nouvelItem={() => ({
            id: `r-${Date.now()}`,
            category: galleryFilters[1]?.id ?? '',
            title: '',
            meta: '',
            scene: 'polish',
            body: 'berline',
            palette: ['#242A33', '#4C5A6B'],
          })}
          champs={[
            { cle: 'title', label: 'Titre', largeur: 7 },
            { cle: 'category', label: 'Catégorie', largeur: 5, aide: 'identifiant d’un filtre' },
            { cle: 'meta', label: 'Détails', aide: 'ex. 14 h atelier · céramique 5 ans' },
            { cle: 'scene', label: 'Scène', largeur: 6, aide: SCENES },
            { cle: 'body', label: 'Carrosserie', largeur: 6, aide: CARROSSERIES },
          ]}
        />
      </Bloc>

      <Bloc
        titre="Note affichée"
        aide="La ligne « note / nombre d’avis » au-dessus des témoignages."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Note">
            <TextInput
              value={reviewSummary.rating}
              onChange={(e) => patchSection('reviewSummary', { rating: e.target.value })}
            />
          </Field>
          <Field label="Sur">
            <TextInput
              value={reviewSummary.scale}
              onChange={(e) => patchSection('reviewSummary', { scale: e.target.value })}
            />
          </Field>
          <Field label="Nombre d’avis">
            <TextInput
              value={reviewSummary.count}
              onChange={(e) => patchSection('reviewSummary', { count: e.target.value })}
            />
          </Field>
        </div>
      </Bloc>

      <Bloc
        titre="Avis clients"
        aide="Affichés sur la page d’accueil (les trois premiers) et en entier sur la page Réalisations."
      >
        <ListeEditable
          items={testimonials as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('testimonials', suivant as never)}
          titreItem={(item) => String(item.name || 'Nouvel avis')}
          ajoutLabel="Ajouter un avis"
          nouvelItem={() => ({
            id: `t-${Date.now()}`,
            name: '',
            city: '',
            service: '',
            rating: 5,
            date: '',
            text: '',
          })}
          champs={[
            { cle: 'name', label: 'Nom', largeur: 3 },
            { cle: 'city', label: 'Ville', largeur: 3 },
            { cle: 'service', label: 'Prestation', largeur: 3 },
            { cle: 'date', label: 'Date', largeur: 3, aide: 'ex. Juin 2026' },
            { cle: 'rating', label: 'Note sur 5', type: 'nombre', largeur: 3 },
            { cle: 'text', label: 'Avis', type: 'zone' },
          ]}
        />
      </Bloc>
    </div>
  );
}
