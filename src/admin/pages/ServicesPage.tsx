import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import StatusPill from '../components/StatusPill';
import { AdminButton, Field, Select, TextArea, TextInput } from '../components/Field';
import { toast } from '../components/toast';
import BasculeSection from '../components/BasculeSection';
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
  const addPack = useSiteStore((state) => state.addPack);
  const updatePack = useSiteStore((state) => state.updatePack);
  const removePack = useSiteStore((state) => state.removePack);
  const addOption = useSiteStore((state) => state.addOption);
  const updateOption = useSiteStore((state) => state.updateOption);
  const removeOption = useSiteStore((state) => state.removeOption);
  const addSystem = useSiteStore((state) => state.addSystem);
  const updateSystem = useSiteStore((state) => state.updateSystem);
  const removeSystem = useSiteStore((state) => state.removeSystem);

  const [packDraft, setPackDraft] = useState<ServicePack | null>(null);
  const [stepsText, setStepsText] = useState('');
  const [optionDraft, setOptionDraft] = useState<ServiceOption | null>(null);
  const [systemDraft, setSystemDraft] = useState<{
    brandId: string;
    modelId: string;
    system: RetrofitSystem;
  } | null>(null);

  // Ce qu'on s'apprête à supprimer, en attente de confirmation.
  const [aSupprimer, setASupprimer] = useState<
    | { type: 'pack'; id: string; libelle: string; detail: string }
    | { type: 'option'; id: string; libelle: string; detail: string }
    | { type: 'systeme'; brandId: string; modelId: string; id: string; libelle: string; detail: string }
    | null
  >(null);

  const [nouveauForfait, setNouveauForfait] = useState<{
    brand: string;
    model: string;
    years: string;
    system: Omit<RetrofitSystem, 'id'>;
  } | null>(null);

  const marquesConnues = [...new Set(catalogue.map((m) => m.brand))].sort();

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-fg">Prestations et tarifs</h1>
            <p className="mt-1 text-xs text-faint">
              Toute modification est visible immédiatement sur la page Prestations du site public.
            </p>
          </div>
          <AdminButton
            onClick={() => {
              const pack = addPack();
              setPackDraft(pack);
              setStepsText('');
              toast('Prestation créée. Renseignez sa fiche.');
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter une prestation
          </AdminButton>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {packs.map((pack) => (
            <article key={pack.id} className="panel flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="num text-[11px] text-faint">{pack.ref}</span>
                <div className="-m-1 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPackDraft({ ...pack });
                      setStepsText(stepsToText(pack.steps));
                    }}
                    title="Modifier"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setASupprimer({
                        type: 'pack',
                        id: pack.id,
                        libelle: pack.name,
                        detail: `Référence ${pack.ref}`,
                      })
                    }
                    title="Supprimer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-signal-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
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

        {packs.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-white/15 p-6 text-center text-xs text-faint">
            Aucune prestation. La page Prestations du site est vide tant que vous n’en ajoutez pas.
          </p>
        ) : null}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-fg">Options à la carte</h2>
          <div className="flex flex-wrap items-center gap-2">
          <BasculeSection id="optionsCarte" nom="Options à la carte" />
          <AdminButton
            variant="ghost"
            onClick={() => {
              setOptionDraft(addOption());
              toast('Option créée. Renseignez-la.');
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter une option
          </AdminButton>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-ink-850 text-left">
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
                <tr key={option.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2.5 font-medium text-fg">{option.label}</td>
                  <td className="max-w-[22rem] truncate px-3 py-2.5 text-xs text-muted">
                    {option.detail}
                  </td>
                  <td className="px-3 py-2.5 text-muted">{option.duration}</td>
                  <td className="num px-3 py-2.5 text-fg">{option.price}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setOptionDraft({ ...option })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setASupprimer({
                            type: 'option',
                            id: option.id,
                            libelle: option.label,
                            detail: 'Option à la carte',
                          })
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-signal-danger"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-fg">Forfaits rétrofit CarPlay</h2>
            <p className="mt-1 max-w-2xl text-xs text-faint">
              Tarif et compatibilité par système embarqué. Le configurateur public lit ces valeurs.
              La marque et le modèle sont créés automatiquement s’ils n’existent pas encore.
            </p>
          </div>
          <AdminButton
            onClick={() =>
              setNouveauForfait({
                brand: '',
                model: '',
                years: '',
                system: {
                  name: '',
                  ref: '',
                  fitment: 'plug',
                  price: 0,
                  duration: '',
                  harness: '',
                  note: '',
                },
              })
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter un forfait
          </AdminButton>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-ink-850 text-left">
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
                      className="border-b border-white/5 last:border-0"
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
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setSystemDraft({
                                brandId: brand.id,
                                modelId: model.id,
                                system: { ...system },
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-fg"
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setASupprimer({
                                type: 'systeme',
                                brandId: brand.id,
                                modelId: model.id,
                                id: system.id,
                                libelle: `${brand.brand} ${model.model} — ${system.name}`,
                                detail:
                                  model.systems.length === 1
                                    ? `Dernier forfait de ce modèle : « ${model.model} » disparaîtra aussi du configurateur.`
                                    : 'Forfait rétrofit',
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-signal-danger"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
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

      {nouveauForfait ? (
        <Modal
          wide
          title="Ajouter un forfait rétrofit"
          subtitle="La marque et le modèle sont créés s’ils n’existent pas encore"
          onClose={() => setNouveauForfait(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setNouveauForfait(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                disabled={
                  !nouveauForfait.brand.trim() ||
                  !nouveauForfait.model.trim() ||
                  !nouveauForfait.system.name.trim()
                }
                onClick={() => {
                  addSystem(nouveauForfait);
                  toast('Forfait ajouté au configurateur.');
                  setNouveauForfait(null);
                }}
              >
                Ajouter
              </AdminButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Marque" hint="Une marque existante ou une nouvelle.">
                <TextInput
                  list="marques-connues"
                  value={nouveauForfait.brand}
                  placeholder="Peugeot"
                  onChange={(event) =>
                    setNouveauForfait({ ...nouveauForfait, brand: event.target.value })
                  }
                />
                <datalist id="marques-connues">
                  {marquesConnues.map((marque) => (
                    <option key={marque} value={marque} />
                  ))}
                </datalist>
              </Field>
              <Field label="Modèle">
                <TextInput
                  value={nouveauForfait.model}
                  placeholder="208 II"
                  onChange={(event) =>
                    setNouveauForfait({ ...nouveauForfait, model: event.target.value })
                  }
                />
              </Field>
              <Field label="Années">
                <TextInput
                  value={nouveauForfait.years}
                  placeholder="2019 — 2024"
                  onChange={(event) =>
                    setNouveauForfait({ ...nouveauForfait, years: event.target.value })
                  }
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Système embarqué">
                <TextInput
                  value={nouveauForfait.system.name}
                  placeholder="i-Cockpit 10″"
                  onChange={(event) =>
                    setNouveauForfait({
                      ...nouveauForfait,
                      system: { ...nouveauForfait.system, name: event.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Référence interface">
                <TextInput
                  value={nouveauForfait.system.ref}
                  placeholder="PSA-NAC-01"
                  onChange={(event) =>
                    setNouveauForfait({
                      ...nouveauForfait,
                      system: { ...nouveauForfait.system, ref: event.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Tarif (€)">
                <TextInput
                  type="number"
                  value={nouveauForfait.system.price}
                  onChange={(event) =>
                    setNouveauForfait({
                      ...nouveauForfait,
                      system: { ...nouveauForfait.system, price: Number(event.target.value) },
                    })
                  }
                />
              </Field>
              <Field label="Durée de pose">
                <TextInput
                  value={nouveauForfait.system.duration}
                  placeholder="2 h"
                  onChange={(event) =>
                    setNouveauForfait({
                      ...nouveauForfait,
                      system: { ...nouveauForfait.system, duration: event.target.value },
                    })
                  }
                />
              </Field>
            </div>

            <Field label="Compatibilité">
              <Select
                value={nouveauForfait.system.fitment}
                onChange={(event) =>
                  setNouveauForfait({
                    ...nouveauForfait,
                    system: { ...nouveauForfait.system, fitment: event.target.value as FitmentId },
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
                value={nouveauForfait.system.harness}
                onChange={(event) =>
                  setNouveauForfait({
                    ...nouveauForfait,
                    system: { ...nouveauForfait.system, harness: event.target.value },
                  })
                }
              />
            </Field>

            <Field label="Note affichée au client">
              <TextArea
                rows={3}
                value={nouveauForfait.system.note}
                onChange={(event) =>
                  setNouveauForfait({
                    ...nouveauForfait,
                    system: { ...nouveauForfait.system, note: event.target.value },
                  })
                }
              />
            </Field>
          </div>
        </Modal>
      ) : null}

      {aSupprimer ? (
        <Modal
          title={
            aSupprimer.type === 'pack'
              ? 'Supprimer cette prestation ?'
              : aSupprimer.type === 'option'
                ? 'Supprimer cette option ?'
                : 'Supprimer ce forfait ?'
          }
          subtitle={aSupprimer.libelle}
          onClose={() => setASupprimer(null)}
          footer={
            <>
              <AdminButton variant="ghost" onClick={() => setASupprimer(null)}>
                Annuler
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={() => {
                  if (aSupprimer.type === 'pack') {
                    removePack(aSupprimer.id);
                    toast('Prestation supprimée.', 'danger');
                  } else if (aSupprimer.type === 'option') {
                    removeOption(aSupprimer.id);
                    toast('Option supprimée.', 'danger');
                  } else {
                    removeSystem(aSupprimer.brandId, aSupprimer.modelId, aSupprimer.id);
                    toast('Forfait supprimé.', 'danger');
                  }
                  setASupprimer(null);
                }}
              >
                Supprimer définitivement
              </AdminButton>
            </>
          }
        >
          <p className="text-sm text-muted">{aSupprimer.detail}</p>
          <p className="mt-3 text-sm text-muted">
            La suppression est immédiate sur le site public et ne peut pas être annulée depuis le
            panel.
          </p>
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
