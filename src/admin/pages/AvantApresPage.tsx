import { Field, TextArea, TextInput } from '../components/Field';
import { Bloc, ChiffresCles } from '../components/Editors';
import { useSiteStore } from '../../store/siteStore';

/**
 * Comparateur avant / après de la page Prestations.
 *
 * Chaque cas porte ses deux légendes, son résumé et ses trois chiffres. Les
 * champs `beforeImage` / `afterImage` acceptent l'adresse d'une vraie photo :
 * dès qu'elle est renseignée, elle remplace l'illustration vectorielle.
 */
export default function AvantApresAdminPage() {
  const beforeAfter = useSiteStore((state) => state.beforeAfter);
  const updateBeforeAfter = useSiteStore((state) => state.updateBeforeAfter);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Comparateur avant / après</h1>
        <p className="mt-1 text-xs text-faint">
          Les cas présentés sur la page Prestations, avec leur banc de comparaison.
        </p>
      </header>

      {beforeAfter.map((cas) => (
        <Bloc key={cas.id} titre={cas.label || cas.id}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Onglet">
              <TextInput
                value={cas.label}
                onChange={(e) => updateBeforeAfter(cas.id, { label: e.target.value })}
              />
            </Field>
            <Field label="Véhicule">
              <TextInput
                value={cas.vehicle}
                onChange={(e) => updateBeforeAfter(cas.id, { vehicle: e.target.value })}
              />
            </Field>
            <Field label="Légende « avant »">
              <TextInput
                value={cas.beforeCaption}
                onChange={(e) => updateBeforeAfter(cas.id, { beforeCaption: e.target.value })}
              />
            </Field>
            <Field label="Légende « après »">
              <TextInput
                value={cas.afterCaption}
                onChange={(e) => updateBeforeAfter(cas.id, { afterCaption: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description de l’intervention">
                <TextArea
                  rows={3}
                  value={cas.summary}
                  onChange={(e) => updateBeforeAfter(cas.id, { summary: e.target.value })}
                />
              </Field>
            </div>
            <Field
              label="Photo « avant »"
              hint="Adresse d’une image, ex. /photos/a4-avant.jpg — laisser vide pour l’illustration"
            >
              <TextInput
                value={cas.beforeImage ?? ''}
                onChange={(e) => updateBeforeAfter(cas.id, { beforeImage: e.target.value })}
              />
            </Field>
            <Field label="Photo « après »">
              <TextInput
                value={cas.afterImage ?? ''}
                onChange={(e) => updateBeforeAfter(cas.id, { afterImage: e.target.value })}
              />
            </Field>
          </div>

          <div className="mt-5">
            <span className="field-label">Chiffres du cas</span>
            <ChiffresCles
              items={cas.specs}
              onChange={(specs) => updateBeforeAfter(cas.id, { specs })}
            />
          </div>
        </Bloc>
      ))}
    </div>
  );
}
