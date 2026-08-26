import { Bascule, Field, TextArea, TextInput } from '../components/Field';
import PhotoUploader from '../components/PhotoUploader';
import BasculeSection from '../components/BasculeSection';
import { Bloc, ChiffresCles, ListeDeTextes, ListeEditable } from '../components/Editors';
import { useSiteStore } from '../../store/siteStore';

/**
 * Contenus de la page d'accueil : l'accroche du haut de page, les chiffres qui
 * la suivent, et les trois pôles de métier.
 */
export default function AccueilPage() {
  const hero = useSiteStore((state) => state.hero);
  const lastJob = useSiteStore((state) => state.lastJob);
  const poles = useSiteStore((state) => state.poles);
  const patchSection = useSiteStore((state) => state.patchSection);
  const setSection = useSiteStore((state) => state.setSection);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Page d’accueil</h1>
        <p className="mt-1 text-xs text-faint">
          Tout ce qui s’affiche avant le showroom : l’accroche, les chiffres, les trois métiers.
        </p>
      </header>

      <Bloc
        titre="Accroche"
        aide="Le premier bloc que voit un visiteur. Le sur-titre s’affiche en petites capitales au-dessus du titre."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sur-titre">
            <TextInput
              value={hero.kicker}
              onChange={(e) => patchSection('hero', { kicker: e.target.value })}
            />
          </Field>
          <Field label="Titre">
            <TextInput
              value={hero.title}
              onChange={(e) => patchSection('hero', { title: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Paragraphe d’introduction">
              <TextArea
                rows={3}
                value={hero.subtitle}
                onChange={(e) => patchSection('hero', { subtitle: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Bouton principal">
            <TextInput
              value={hero.primaryCta}
              onChange={(e) => patchSection('hero', { primaryCta: e.target.value })}
            />
          </Field>
          <Field label="Bouton secondaire">
            <TextInput
              value={hero.secondaryCta}
              onChange={(e) => patchSection('hero', { secondaryCta: e.target.value })}
            />
          </Field>
        </div>
      </Bloc>

      <Bloc
        titre="Dernier chantier"
        aide="L’encart posé sur la photo, en haut à droite de la page d’accueil. Sans photo déposée, l’illustration générée reste affichée. Masquez-le entre deux chantiers dignes d’être montrés : mieux vaut rien qu’un chantier d’il y a trois mois présenté comme le dernier."
        actions={
          <Bascule
            checked={lastJob.enabled}
            onChange={(enabled) => patchSection('lastJob', { enabled })}
            labelActif="Affiché sur le site"
            labelInactif="Masqué"
          />
        }
      >
        <div className={lastJob.enabled ? '' : 'pointer-events-none opacity-40'}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sur-titre" hint="En petites capitales au-dessus du libellé.">
              <TextInput
                value={lastJob.eyebrow}
                onChange={(e) => patchSection('lastJob', { eyebrow: e.target.value })}
              />
            </Field>
            <Field label="Prestation réalisée">
              <TextInput
                value={lastJob.title}
                placeholder="Détailing complet + traitement cuir"
                onChange={(e) => patchSection('lastJob', { title: e.target.value })}
              />
            </Field>
            <Field label="Véhicule" hint="Facultatif. Laissé vide, la ligne n’apparaît pas.">
              <TextInput
                value={lastJob.vehicle}
                placeholder="BMW Série 1 118d"
                onChange={(e) => patchSection('lastJob', { vehicle: e.target.value })}
              />
            </Field>
            <Field label="Pastille verte" hint="Facultatif. Un délai, une garantie, un résultat.">
              <TextInput
                value={lastJob.badge}
                placeholder="Livrée en 48 h"
                onChange={(e) => patchSection('lastJob', { badge: e.target.value })}
              />
            </Field>
          </div>

          <div className="mt-5">
            <span className="field-label">Photos</span>
            <p className="mb-3 text-[11px] text-faint">
              Glissez vos photos ici. La photo de couverture est celle affichée en grand ; les
              autres apparaissent en miniatures sous l’encart. Les fichiers sont réduits par votre
              navigateur puis stockés sur votre serveur.
            </p>
            <PhotoUploader
              photos={lastJob.photos}
              coverIndex={lastJob.coverIndex}
              onChange={(patch) => patchSection('lastJob', patch)}
            />
          </div>
        </div>
      </Bloc>

      <Bloc
        titre="Chiffres de la page d’accueil"
        aide="La bande de quatre chiffres sous l’accroche. Annoncez des valeurs que vous pouvez justifier."
        actions={<BasculeSection id="chiffresAccueil" nom="Chiffres de l’accueil" />}
      >
        <ChiffresCles
          items={hero.facts}
          onChange={(facts) => patchSection('hero', { facts })}
        />
      </Bloc>

      <Bloc
        titre="Les trois métiers"
        aide="Chaque carte renvoie vers sa page dédiée. L’ordre ici est celui de la page d’accueil."
        actions={<BasculeSection id="metiers" nom="Les trois métiers" />}
      >
        <ListeEditable
          items={poles as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('poles', suivant as never)}
          titreItem={(item) => String(item.title || 'Nouveau métier')}
          ajoutLabel="Ajouter un métier"
          nouvelItem={() => ({
            id: `pole-${Date.now()}`,
            index: '',
            icon: 'Gem',
            accent: 'brass',
            title: '',
            lead: '',
            points: [],
            to: '/prestations',
            cta: 'En savoir plus',
          })}
          champs={[
            { cle: 'title', label: 'Titre', largeur: 6 },
            { cle: 'cta', label: 'Libellé du lien', largeur: 6 },
            { cle: 'lead', label: 'Description', type: 'zone' },
            {
              cle: 'to',
              label: 'Page de destination',
              largeur: 6,
              aide: '/prestations, /retrofit-carplay, /vendre-sa-voiture…',
            },
            {
              cle: 'icon',
              label: 'Icône',
              largeur: 6,
              aide: 'Nom d’icône Lucide : Gem, MonitorSmartphone, Handshake…',
            },
          ]}
        />

        <div className="mt-5 space-y-5">
          {poles.map((pole, index) => (
            <div key={pole.id} className="rounded-md border border-white/10 bg-ink-900 p-4">
              <span className="text-xs font-semibold text-muted">
                Arguments de « {pole.title || `métier ${index + 1}`} »
              </span>
              <div className="mt-3">
                <ListeDeTextes
                  items={pole.points as string[]}
                  placeholder="Un argument court et vérifiable"
                  onChange={(points) => {
                    const suivant = poles.map((p, i) => (i === index ? { ...p, points } : p));
                    setSection('poles', suivant as never);
                  }}
                  ajoutLabel="Ajouter un argument"
                />
              </div>
            </div>
          ))}
        </div>
      </Bloc>
      <Bloc
        titre="Autres sections"
        aide="Deux blocs sans écran d’édition dédié : leur contenu est fixe, seul leur affichage se règle ici."
      >
        <ul className="divide-y divide-white/5">
          <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">Véhicules sur l’accueil</p>
              <p className="mt-0.5 text-xs text-faint">
                L’aperçu de trois véhicules. La page « Véhicules à vendre » reste accessible par le
                menu quoi qu’il arrive.
              </p>
            </div>
            <BasculeSection id="showroomAccueil" nom="Véhicules sur l’accueil" />
          </li>
          <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">Bandeau « Demander un devis »</p>
              <p className="mt-0.5 text-xs text-faint">
                L’encart d’appel à l’action, en bas de presque toutes les pages.
              </p>
            </div>
            <BasculeSection id="bandeauDevis" nom="Bandeau de devis" />
          </li>
        </ul>
      </Bloc>

    </div>
  );
}
