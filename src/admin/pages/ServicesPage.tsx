import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { AdminButton, Field, Select, TextArea, TextInput } from '../components/Field';
import { toast } from '../components/toast';
import { useSiteStore } from '../../store/siteStore';
import { FITMENT } from '../../data/retrofit.js';
import type {
  FitmentId,
  PackStep,
  RetrofitSystem,
  ServiceOption,
  ServicePack,
} from '../../store/types';

const fitmentMeta = FITMENT as Record<string, { label: string; tone: string }>;

/** Les étapes s'éditent en texte : « intitulé | détail | durée », une ligne par étape. */
const stepsToText = (steps: PackStep[]) =>
  steps.map((step) => `${step.label} | ${step.detail} | ${step.duration}`).join('\n');

const textToSteps = (value: string): PackStep[] =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', detail = '', duration = ''] = line.split('|').map((part) => part.trim());
      return { label, detail, duration };
    });

export default function ServicesPage() {
  const packs = useSiteStore((state) => state.packs);
  const options = useSiteStore((state) => state.options);
  const catalogue = useSiteStore((state) => state.catalogue);
  const updatePack = useSiteStore((state) => state.updatePack);
  const updateOption = useSiteStore((state) => state.updateOption);
  const updateSystem = useSiteStore((state) => state.updateSystem);

  const [packDraft, setPackDraft] = useState<ServicePack | null>(null);
  const [stepsText, setStepsText] = useState('');
  const [optionDraft, setOptionDraft] = useState<ServiceOption | null>(null);
  const [systemDraft, setSystemDraft] = useState<{
    brandId: string;
    modelId: string;
    system: RetrofitSystem;
  } | null>(null);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-lg font-semibold text-fg">Prestations et tarifs</h1>
        <p className="mt-1 text-xs text-faint">
          Toute modification est visible immédiatement sur la page Prestations du site public.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {packs.map((pack) => (
            <article key={pack.id} className="panel flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="num text-[11px] text-faint">{pack.ref}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPackDraft({ ...pack });
                    setStepsText(stepsToText(pack.steps));
                  }}
                  title="Modifier"
                  className="-m-1 flex h-8 w-8 items-center justify-center rounded text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <h2 className="mt-2 text-sm font-semibold text-fg">{pack.name}</h2>
              <p className="mt-1 text-xs text-faint">{pack.subtitle}</p>

              <dl className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-faint">Prix de base</dt>
                  <dd className="num font-semibold text-fg">{pack.price} €</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-faint">Temps estimé</dt>
                  <dd className="text-muted">{pack.duration}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-faint">Étapes</dt>
                  <dd className="num text-muted">{pack.steps.length}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-fg">Options à la carte</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-ink-700">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-850 text-left">
                {['Option', 'Détail', 'Durée', 'Prix', ''].map((head, index) => (
                  <th
                    key={head || index}
                    className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option.id} className="border-b border-ink-800 last:border-0">
                  <td className="px-3 py-2.5 font-medium text-fg">{option.label}</td>
                  <td className="max-w-[22rem] truncate px-3 py-2.5 text-xs text-muted">
                    {option.detail}
                  </td>
                  <td className="px-3 py-2.5 text-muted">{option.duration}</td>
                  <td className="num px-3 py-2.5 text-fg">{option.price}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => setOptionDraft({ ...option })}
                      className="flex h-8 w-8 items-center justify-center rounded text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-fg">Forfaits rétrofit CarPlay</h2>
        <p className="mt-1 text-xs text-faint">
          Tarif et compatibilité par système embarqué. Le configurateur public lit ces valeurs.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-ink-700">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-850 text-left">
                {['Marque', 'Modèle', 'Système', 'Réf.', 'Compatibilité', 'Durée', 'Tarif', ''].map(
                  (head, index) => (
                    <th
                      key={head || index}
                      className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-faint"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {catalogue.flatMap((brand) =>
                brand.models.flatMap((model) =>
                  model.systems.map((system) => (
                    <tr
                      key={`${brand.id}-${model.id}-${system.id}`}
                      className="border-b border-ink-800 last:border-0"
                    >
                      <td className="px-3 py-2.5 font-medium text-fg">{brand.brand}</td>
                      <td className="px-3 py-2.5 text-muted">{model.model}</td>
                      <td className="px-3 py-2.5 text-muted">{system.name}</td>
                      <td className="num px-3 py-2.5 text-xs text-faint">{system.ref}</td>
                      <td className="px-3 py-2.5">
                        <StatusPill
                          label={fitmentMeta[system.fitment].label}
                          tone={fitmentMeta[system.fitment].tone}
                        />
                      </td>
                      <td className="px-3 py-2.5 text-muted">{system.duration}</td>
                      <td className="num px-3 py-2.5 font-semibold text-fg">{system.price} €</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSystemDraft({
                              brandId: brand.id,
                              modelId: model.id,
                              system: { ...system },
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {packDraft ? (
        <Modal
          wide
          title={packDraft.name}
          subtitle={`Référence ${packDraft.ref}`}
          onClose={() => setPackDraft(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setPackDraft(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                onClick={() => {
                  updatePack(packDraft.id, { ...packDraft, steps: textToSteps(stepsText) });
                  toast('Prestation mise à jour.');
                  setPackDraft(null);
                }}
              >
                Enregistrer
              </AdminButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom du pack">
                <TextInput
                  value={packDraft.name}
                  onChange={(event) => setPackDraft({ ...packDraft, name: event.target.value })}
                />
              </Field>
              <Field label="Sous-titre">
                <TextInput
                  value={packDraft.subtitle}
                  onChange={(event) => setPackDraft({ ...packDraft, subtitle: event.target.value })}
                />
              </Field>
              <Field label="Prix de base (€)">
                <TextInput
                  type="number"
                  value={packDraft.price}
                  onChange={(event) =>
                    setPackDraft({ ...packDraft, price: Number(event.target.value) })
                  }
                />
              </Field>
              <Field label="Mention tarifaire">
                <TextInput
                  value={packDraft.priceNote}
                  onChange={(event) => setPackDraft({ ...packDraft, priceNote: event.target.value })}
                />
              </Field>
              <Field label="Temps d’intervention estimé">
                <TextInput
                  value={packDraft.duration}
                  onChange={(event) => setPackDraft({ ...packDraft, duration: event.target.value })}
                />
              </Field>
              <Field label="Immobilisation">
                <TextInput
                  value={packDraft.immobilisation}
                  onChange={(event) =>
                    setPackDraft({ ...packDraft, immobilisation: event.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Résumé">
              <TextArea
                rows={3}
                value={packDraft.summary}
                onChange={(event) => setPackDraft({ ...packDraft, summary: event.target.value })}
              />
            </Field>

            <Field
              label="Étapes incluses"
              hint="Une ligne par étape, au format : intitulé | détail | durée"
            >
              <TextArea
                rows={7}
                value={stepsText}
                onChange={(event) => setStepsText(event.target.value)}
                className="font-mono text-xs"
              />
            </Field>

            <Field label="Produits et outillage" hint="Séparés par des virgules">
              <TextInput
                value={packDraft.products.join(', ')}
                onChange={(event) =>
                  setPackDraft({
                    ...packDraft,
                    products: event.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>

            <Field label="Note de bas de fiche">
              <TextArea
                rows={2}
                value={packDraft.note}
                onChange={(event) => setPackDraft({ ...packDraft, note: event.target.value })}
              />
            </Field>
          </div>
        </Modal>
      ) : null}

      {optionDraft ? (
        <Modal
          title={optionDraft.label}
          subtitle="Option à la carte"
          onClose={() => setOptionDraft(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setOptionDraft(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                onClick={() => {
                  updateOption(optionDraft.id, optionDraft);
                  toast('Option mise à jour.');
                  setOptionDraft(null);
                }}
              >
                Enregistrer
              </AdminButton>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Intitulé">
              <TextInput
                value={optionDraft.label}
                onChange={(event) => setOptionDraft({ ...optionDraft, label: event.target.value })}
              />
            </Field>
            <Field label="Détail technique">
              <TextArea
                rows={2}
                value={optionDraft.detail}
                onChange={(event) => setOptionDraft({ ...optionDraft, detail: event.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prix affiché" hint="Texte libre : « 79 € la paire », « dès 189 € »">
                <TextInput
                  value={optionDraft.price}
                  onChange={(event) => setOptionDraft({ ...optionDraft, price: event.target.value })}
                />
              </Field>
              <Field label="Durée">
                <TextInput
                  value={optionDraft.duration}
                  onChange={(event) =>
                    setOptionDraft({ ...optionDraft, duration: event.target.value })
                  }
                />
              </Field>
            </div>
          </div>
        </Modal>
      ) : null}

      {systemDraft ? (
        <Modal
          title={systemDraft.system.name}
          subtitle={`Référence interface ${systemDraft.system.ref}`}
          onClose={() => setSystemDraft(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setSystemDraft(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                onClick={() => {
                  updateSystem(
                    systemDraft.brandId,
                    systemDraft.modelId,
                    systemDraft.system.id,
                    systemDraft.system
                  );
                  toast('Forfait rétrofit mis à jour.');
                  setSystemDraft(null);
                }}
              >
                Enregistrer
              </AdminButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tarif (€)">
                <TextInput
                  type="number"
                  value={systemDraft.system.price}
                  onChange={(event) =>
                    setSystemDraft({
                      ...systemDraft,
                      system: { ...systemDraft.system, price: Number(event.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="Durée de pose">
                <TextInput
                  value={systemDraft.system.duration}
                  onChange={(event) =>
                    setSystemDraft({
                      ...systemDraft,
                      system: { ...systemDraft.system, duration: event.target.value },
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Compatibilité">
              <Select
                value={systemDraft.system.fitment}
                onChange={(event) =>
                  setSystemDraft({
                    ...systemDraft,
                    system: { ...systemDraft.system, fitment: event.target.value as FitmentId },
                  })
                }
              >
                {Object.entries(fitmentMeta).map(([id, meta]) => (
                  <option key={id} value={id}>
                    {meta.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Faisceau / méthode">
              <TextInput
                value={systemDraft.system.harness}
                onChange={(event) =>
                  setSystemDraft({
                    ...systemDraft,
                    system: { ...systemDraft.system, harness: event.target.value },
                  })
                }
              />
            </Field>

            <Field label="Note affichée au client">
              <TextArea
                rows={3}
                value={systemDraft.system.note}
                onChange={(event) =>
                  setSystemDraft({
                    ...systemDraft,
                    system: { ...systemDraft.system, note: event.target.value },
                  })
                }
              />
            </Field>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
