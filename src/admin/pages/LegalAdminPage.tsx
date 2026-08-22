import { AlertTriangle } from 'lucide-react';
import { Field, TextArea, TextInput } from '../components/Field';
import { Bloc, ListeEditable } from '../components/Editors';
import { useSiteStore } from '../../store/siteStore';

/**
 * Mentions légales et identité de l'entreprise.
 *
 * Ces mentions sont une obligation (art. 6 III de la LCEN) : le site les affiche
 * telles quelles, et les champs laissés vides sont simplement masqués plutôt que
 * remplis d'approximations.
 */
export default function LegalAdminPage() {
  const company = useSiteStore((state) => state.company);
  const brand = useSiteStore((state) => state.brand);
  const navLinks = useSiteStore((state) => state.navLinks);
  const patchSection = useSiteStore((state) => state.patchSection);
  const setSection = useSiteStore((state) => state.setSection);

  const manquants = [
    !company.siret && 'SIRET',
    !company.vat && 'TVA intracommunautaire',
    !company.rcs && 'RCS',
    !company.insurance && 'assurance professionnelle',
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Informations légales</h1>
        <p className="mt-1 text-xs text-faint">
          Identité de l’entreprise, mentions obligatoires et menu de navigation.
        </p>
      </header>

      {manquants.length > 0 ? (
        <div className="flex gap-3 rounded-md border border-signal-warn/40 bg-signal-warn/10 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-signal-warn" aria-hidden="true" />
          <div className="text-xs leading-relaxed text-signal-warn">
            <p className="font-semibold">Mentions obligatoires incomplètes</p>
            <p className="mt-1">
              Manque : {manquants.join(', ')}. Ces informations sont exigées par la loi sur tout
              site professionnel. Tant qu’elles sont vides, elles n’apparaissent simplement pas
              dans le pied de page ni sur la page Mentions légales.
            </p>
          </div>
        </div>
      ) : null}

      <Bloc titre="Entreprise" aide="Repris dans le pied de page et sur la page Mentions légales.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Raison sociale">
            <TextInput
              value={company.legalName}
              onChange={(e) => patchSection('company', { legalName: e.target.value })}
            />
          </Field>
          <Field label="Capital social" hint="ex. 10 000 € — laisser vide si sans objet">
            <TextInput
              value={company.capital}
              onChange={(e) => patchSection('company', { capital: e.target.value })}
            />
          </Field>
          <Field label="SIRET">
            <TextInput
              value={company.siret}
              placeholder="14 chiffres"
              onChange={(e) => patchSection('company', { siret: e.target.value })}
            />
          </Field>
          <Field label="TVA intracommunautaire">
            <TextInput
              value={company.vat}
              placeholder="FR…"
              onChange={(e) => patchSection('company', { vat: e.target.value })}
            />
          </Field>
          <Field label="RCS" hint="ex. RCS Strasbourg 902 481 337">
            <TextInput
              value={company.rcs}
              onChange={(e) => patchSection('company', { rcs: e.target.value })}
            />
          </Field>
          <Field label="Directeur de la publication">
            <TextInput
              value={company.director}
              onChange={(e) => patchSection('company', { director: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Hébergeur">
              <TextInput
                value={company.host}
                onChange={(e) => patchSection('company', { host: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Assurance responsabilité civile professionnelle">
              <TextArea
                rows={2}
                value={company.insurance}
                onChange={(e) => patchSection('company', { insurance: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </Bloc>

      <Bloc titre="Marque" aide="Nom, accroche du pied de page et année de création.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nom">
            <TextInput
              value={brand.name}
              onChange={(e) => patchSection('brand', { name: e.target.value })}
            />
          </Field>
          <Field label="Accroche">
            <TextInput
              value={brand.baseline}
              onChange={(e) => patchSection('brand', { baseline: e.target.value })}
            />
          </Field>
          <Field label="Depuis">
            <TextInput
              type="number"
              value={String(brand.since)}
              onChange={(e) => patchSection('brand', { since: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Bloc>

      <Bloc
        titre="Menu de navigation"
        aide="Ordre et libellés du menu, en haut du site et dans le pied de page. L’adresse doit correspondre à une page existante."
      >
        <ListeEditable
          items={navLinks as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('navLinks', suivant as never)}
          titreItem={(item) => String(item.label || 'Entrée de menu')}
          ajoutLabel="Ajouter une entrée"
          nouvelItem={() => ({ id: `nav-${Date.now()}`, path: '/', label: '' })}
          champs={[
            { cle: 'label', label: 'Libellé', largeur: 6 },
            { cle: 'path', label: 'Adresse', largeur: 6, aide: '/prestations, /contact…' },
          ]}
        />
      </Bloc>
    </div>
  );
}
