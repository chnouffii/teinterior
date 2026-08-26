import { ChevronDown, ChevronUp, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { AdminButton, Field, Select, TextArea, TextInput } from '../components/Field';
import { Bloc, ListeEditable } from '../components/Editors';
import BasculeSection from '../components/BasculeSection';
import PhotoUploader from '../components/PhotoUploader';
import { useSiteStore } from '../../store/siteStore';
import type { Realisation } from '../../store/types';

/**
 * Silhouettes et scènes de l'illustration vectorielle de repli.
 *
 * Listes fermées plutôt que saisie libre : ce sont les seules valeurs que sait
 * dessiner `CarVisual`, et une faute de frappe renvoyait jusqu'ici une berline
 * sous une scène de polissage sans le moindre avertissement.
 */
const SCENES = [
  { id: 'interior', label: 'Habitacle' },
  { id: 'polish', label: 'Carrosserie' },
  { id: 'screen', label: 'Écran multimédia' },
  { id: 'sale', label: 'Véhicule à vendre' },
  { id: 'tint', label: 'Vitres teintées' },
];

const CARROSSERIES = [
  { id: 'berline', label: 'Berline' },
  { id: 'break', label: 'Break' },
  { id: 'suv', label: 'SUV' },
  { id: 'citadine', label: 'Citadine' },
  { id: 'coupe', label: 'Coupé' },
];

/** Le filtre « tout » ne classe rien : il ne peut pas être choisi sur un chantier. */
const TOUS = 'tous';

/**
 * Éditeur d'un chantier : ses textes, ses photos, et l'illustration qui prend
 * le relais tant qu'aucune photo n'a été déposée.
 */
function CarteRealisation({
  item,
  index,
  total,
  categories,
  onModifier,
  onDeplacer,
  onSupprimer,
}: {
  item: Realisation;
  index: number;
  total: number;
  categories: { id: string; label: string }[];
  onModifier: (patch: Partial<Realisation>) => void;
  onDeplacer: (delta: number) => void;
  onSupprimer: () => void;
}) {
  const photos = item.photos ?? [];
  const orpheline = Boolean(item.category) && !categories.some((c) => c.id === item.category);

  return (
    <div className="rounded-md border border-white/10 bg-ink-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs font-semibold text-muted">
          {item.title || 'Nouvelle réalisation'}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDeplacer(-1)}
            disabled={index === 0}
            aria-label="Déplacer vers le haut"
            className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-muted transition-colors hover:text-fg disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDeplacer(1)}
            disabled={index === total - 1}
            aria-label="Déplacer vers le bas"
            className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-muted transition-colors hover:text-fg disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onSupprimer}
            aria-label="Supprimer cette réalisation"
            className="flex h-8 w-8 items-center justify-center rounded border border-signal-danger/40 text-signal-danger transition-colors hover:bg-signal-danger/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Titre" hint="Ce qui s’affiche sous la photo.">
          <TextInput
            value={item.title}
            placeholder="Golf VII — habitacle repris"
            onChange={(e) => onModifier({ title: e.target.value })}
          />
        </Field>

        <Field
          label="Catégorie"
          hint={orpheline ? undefined : 'Le filtre sous lequel ce chantier apparaît.'}
        >
          <Select value={item.category} onChange={(e) => onModifier({ category: e.target.value })}>
            <option value="">— Aucune (visible dans « Tout » seulement) —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
            {/*
              Une catégorie qui ne correspond plus à aucun filtre — filtre
              renommé ou supprimé — reste proposée, sans quoi la liste
              déroulante l'écraserait en silence à la première ouverture.
            */}
            {orpheline ? <option value={item.category}>{item.category} (filtre supprimé)</option> : null}
          </Select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Détails"
            hint="Une ligne courte sous le titre : durée, produits, résultat."
          >
            <TextInput
              value={item.meta}
              placeholder="4 h atelier · cuir nourri · ozone 60 min"
              onChange={(e) => onModifier({ meta: e.target.value })}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Description"
            hint="Facultatif. Affichée quand le visiteur ouvre le chantier en grand."
          >
            <TextArea
              rows={3}
              value={item.detail ?? ''}
              placeholder="Ce qui a été fait, ce qui partait et ce qui ne partait pas, le temps passé."
              onChange={(e) => onModifier({ detail: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {orpheline ? (
        <p className="mt-3 flex items-start gap-2 rounded border border-signal-warn/40 bg-signal-warn/10 px-3 py-2 text-[11px] text-signal-warn">
          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            La catégorie « {item.category} » ne correspond à aucun filtre : ce chantier n’apparaît
            que sous « Tout ». Ajoutez le filtre plus haut, ou choisissez-en un autre.
          </span>
        </p>
      ) : null}

      <div className="mt-5">
        <span className="field-label">Photos</span>
        <p className="mb-3 text-[11px] text-faint">
          Glissez-les ici comme sur une fiche véhicule. La couverture s’affiche en vignette, les
          autres suivent quand le visiteur ouvre le chantier.
        </p>
        <PhotoUploader
          photos={photos}
          coverIndex={item.coverIndex ?? 0}
          onChange={(patch) => onModifier(patch as Partial<Realisation>)}
        />
      </div>

      <details className="mt-4 rounded border border-white/10 bg-ink-950/40 px-3 py-2">
        <summary className="cursor-pointer text-[11px] font-semibold text-faint">
          Illustration de repli
          {photos.length > 0 ? ' — inutilisée, ce chantier a des photos' : ''}
        </summary>
        <p className="mt-2 text-[11px] leading-relaxed text-faint">
          Le dessin affiché tant qu’aucune photo n’est déposée. Il permet de préparer un chantier
          avant la séance photo sans laisser un cadre vide sur le site.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Scène">
            <Select
              value={item.scene}
              onChange={(e) => onModifier({ scene: e.target.value as Realisation['scene'] })}
            >
              {SCENES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Carrosserie">
            <Select
              value={item.body ?? 'berline'}
              onChange={(e) => onModifier({ body: e.target.value as Realisation['body'] })}
            >
              {CARROSSERIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </details>
    </div>
  );
}

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

  // « Tout » n'est pas une catégorie : on ne le propose pas sur un chantier.
  const categories = galleryFilters.filter((f) => f.id && f.id !== TOUS);

  const majGalerie = (suivant: Realisation[]) => setSection('gallery', suivant);

  const modifier = (index: number, patch: Partial<Realisation>) =>
    majGalerie(gallery.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const deplacer = (index: number, delta: number) => {
    const cible = index + delta;
    if (cible < 0 || cible >= gallery.length) return;
    const suivant = [...gallery];
    [suivant[index], suivant[cible]] = [suivant[cible], suivant[index]];
    majGalerie(suivant);
  };

  const ajouter = () =>
    majGalerie([
      ...gallery,
      {
        id: `r-${Date.now()}`,
        category: categories[0]?.id ?? '',
        title: '',
        meta: '',
        detail: '',
        photos: [],
        coverIndex: 0,
        scene: 'interior',
        palette: ['#242A33', '#4C5A6B'],
        body: 'berline',
      },
    ]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Réalisations et avis</h1>
        <p className="mt-1 text-xs text-faint">
          Les chantiers montrés sur la page Réalisations, leurs filtres, et les témoignages clients.
        </p>
      </header>

      <Bloc
        titre="Filtres de la galerie"
        aide="Les boutons au-dessus de la galerie. Créez-en autant que vous avez de métiers — chaque chantier se range ensuite dans l’un d’eux. Le premier, « Tout », affiche l’ensemble et ne se supprime pas."
      >
        <ListeEditable
          items={galleryFilters as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('galleryFilters', suivant as never)}
          titreItem={(item, index) => {
            const compte = gallery.filter((r) => r.category === item.id).length;
            if (item.id === TOUS) return `${item.label || 'Tout'} — tous les chantiers`;
            return `${item.label || `Filtre ${index + 1}`} — ${compte} chantier${compte > 1 ? 's' : ''}`;
          }}
          ajoutLabel="Ajouter un filtre"
          nouvelItem={() => ({ id: '', label: '' })}
          champs={[
            {
              cle: 'id',
              label: 'Identifiant',
              largeur: 5,
              aide: 'sans espace ni accent — sert à ranger les chantiers',
            },
            { cle: 'label', label: 'Libellé affiché', largeur: 7 },
          ]}
        />
      </Bloc>

      <Bloc
        titre="Chantiers"
        aide="Un bloc par véhicule passé à l’atelier. L’ordre ici est celui de la page ; les trois premiers de chaque filtre sont les plus vus."
      >
        {gallery.length === 0 ? (
          <p className="rounded border border-dashed border-white/15 px-4 py-6 text-center text-xs text-faint">
            Aucun chantier pour l’instant.
          </p>
        ) : (
          <div className="space-y-4">
            {gallery.map((item, index) => (
              <CarteRealisation
                key={item.id}
                item={item}
                index={index}
                total={gallery.length}
                categories={categories}
                onModifier={(patch) => modifier(index, patch)}
                onDeplacer={(delta) => deplacer(index, delta)}
                onSupprimer={() => majGalerie(gallery.filter((_, i) => i !== index))}
              />
            ))}
          </div>
        )}

        <AdminButton variant="ghost" onClick={ajouter} className="mt-4">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Ajouter une réalisation
        </AdminButton>
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
        actions={<BasculeSection id="avis" nom="Avis clients" />}
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
