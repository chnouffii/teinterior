import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { AdminButton, Field, TextArea, TextInput } from './Field';

/** Encadré de section, avec titre et explication de ce que le bloc pilote. */
export function Bloc({
  titre,
  aide,
  actions,
  children,
}: {
  titre: string;
  aide?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-fg">{titre}</h2>
          {aide ? <p className="mt-1 max-w-2xl text-xs leading-relaxed text-faint">{aide}</p> : null}
        </div>
        {actions}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export type ChampDef<T> = {
  cle: keyof T & string;
  label: string;
  type?: 'texte' | 'zone' | 'nombre';
  aide?: string;
  /** Largeur en colonnes sur la grille de 12. */
  largeur?: number;
};

/**
 * Éditeur de liste générique : ajout, suppression, réordonnancement, et un jeu
 * de champs par élément.
 *
 * L'ordre compte sur le site (étapes d'une intervention, pôles de la page
 * d'accueil, entrées de menu), d'où les flèches de déplacement.
 */
export function ListeEditable<T extends Record<string, unknown>>({
  items,
  champs,
  onChange,
  nouvelItem,
  titreItem,
  ajoutLabel = 'Ajouter',
  reordonnable = true,
  supprimable = true,
}: {
  items: T[];
  champs: ChampDef<T>[];
  onChange: (suivant: T[]) => void;
  nouvelItem?: () => T;
  titreItem?: (item: T, index: number) => string;
  ajoutLabel?: string;
  reordonnable?: boolean;
  supprimable?: boolean;
}) {
  const modifier = (index: number, cle: string, valeur: unknown) => {
    const suivant = [...items];
    suivant[index] = { ...suivant[index], [cle]: valeur };
    onChange(suivant);
  };

  const deplacer = (index: number, delta: number) => {
    const cible = index + delta;
    if (cible < 0 || cible >= items.length) return;
    const suivant = [...items];
    [suivant[index], suivant[cible]] = [suivant[cible], suivant[index]];
    onChange(suivant);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-md border border-white/10 bg-ink-900 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-muted">
              {titreItem ? titreItem(item, index) : `Élément ${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              {reordonnable ? (
                <>
                  <button
                    type="button"
                    onClick={() => deplacer(index, -1)}
                    disabled={index === 0}
                    aria-label="Déplacer vers le haut"
                    className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-muted transition-colors hover:text-fg disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deplacer(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label="Déplacer vers le bas"
                    className="flex h-8 w-8 items-center justify-center rounded border border-white/10 text-muted transition-colors hover:text-fg disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </>
              ) : null}
              {supprimable ? (
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  aria-label="Supprimer"
                  className="flex h-8 w-8 items-center justify-center rounded border border-signal-danger/40 text-signal-danger transition-colors hover:bg-signal-danger/10"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-12">
            {champs.map((champ) => (
              <div
                key={champ.cle}
                style={{ gridColumn: `span ${champ.largeur ?? 12} / span ${champ.largeur ?? 12}` }}
              >
                <Field label={champ.label} hint={champ.aide}>
                  {champ.type === 'zone' ? (
                    <TextArea
                      rows={3}
                      value={String(item[champ.cle] ?? '')}
                      onChange={(e) => modifier(index, champ.cle, e.target.value)}
                    />
                  ) : (
                    <TextInput
                      type={champ.type === 'nombre' ? 'number' : 'text'}
                      value={String(item[champ.cle] ?? '')}
                      onChange={(e) =>
                        modifier(
                          index,
                          champ.cle,
                          champ.type === 'nombre' ? Number(e.target.value) : e.target.value
                        )
                      }
                    />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 px-4 py-6 text-center text-xs text-faint">
          Aucun élément. Ce bloc n’apparaîtra pas sur le site.
        </p>
      ) : null}

      {nouvelItem ? (
        <AdminButton variant="ghost" onClick={() => onChange([...items, nouvelItem()])}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {ajoutLabel}
        </AdminButton>
      ) : null}
    </div>
  );
}

/** Liste de chaînes simples (puces, garanties, arguments). */
export function ListeDeTextes({
  items,
  onChange,
  ajoutLabel = 'Ajouter une ligne',
  placeholder,
}: {
  items: string[];
  onChange: (suivant: string[]) => void;
  ajoutLabel?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((valeur, index) => (
        <div key={index} className="flex items-center gap-2">
          <TextInput
            value={valeur}
            placeholder={placeholder}
            onChange={(e) => {
              const suivant = [...items];
              suivant[index] = e.target.value;
              onChange(suivant);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="Supprimer la ligne"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-signal-danger/40 text-signal-danger transition-colors hover:bg-signal-danger/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
      <AdminButton variant="ghost" onClick={() => onChange([...items, ''])}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {ajoutLabel}
      </AdminButton>
    </div>
  );
}

/** Paires libellé / valeur, utilisées par toutes les bandes de chiffres du site. */
export function ChiffresCles({
  items,
  onChange,
}: {
  items: { label: string; value: string }[];
  onChange: (suivant: { label: string; value: string }[]) => void;
}) {
  return (
    <ListeEditable
      items={items as unknown as Record<string, unknown>[]}
      champs={[
        { cle: 'value', label: 'Chiffre', largeur: 4 },
        { cle: 'label', label: 'Légende', largeur: 8 },
      ]}
      onChange={(suivant) => onChange(suivant as unknown as { label: string; value: string }[])}
      nouvelItem={() => ({ value: '', label: '' })}
      titreItem={(item) => String(item.value || 'Nouveau chiffre')}
      ajoutLabel="Ajouter un chiffre"
    />
  );
}
