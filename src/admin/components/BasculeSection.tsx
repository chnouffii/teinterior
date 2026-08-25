import { Bascule } from './Field';
import { toast } from './toast';
import { useSiteStore } from '../../store/siteStore';
import { sectionVisible } from '../../data/sections.js';

/**
 * Interrupteur d'affichage d'une section du site public.
 *
 * Posé à côté du contenu qu'il gouverne plutôt que dans un écran de réglages à
 * part : on décide de montrer ou non les avis au moment où on les relit, pas en
 * allant chercher une case dans un autre menu.
 */
export default function BasculeSection({ id, nom }: { id: string; nom: string }) {
  const sections = useSiteStore((state) => state.sections);
  const patchSection = useSiteStore((state) => state.patchSection);
  const visible = sectionVisible(sections, id);

  return (
    <Bascule
      checked={visible}
      onChange={(actif) => {
        patchSection('sections', { [id]: actif });
        toast(actif ? `${nom} — affiché sur le site.` : `${nom} — masqué du site.`, actif ? 'ok' : 'danger');
      }}
      labelActif="Affiché sur le site"
      labelInactif="Masqué"
    />
  );
}
