import { useSiteStore } from '../store/siteStore';
import { sectionVisible } from '../data/sections.js';

/**
 * Une section du site est-elle affichée ?
 *
 * Absente de la configuration, elle l'est : une section ajoutée par une
 * nouvelle version du site ne doit pas disparaître parce que le fichier de
 * contenus du serveur, plus ancien, ne la connaît pas encore.
 */
export default function useSection(id) {
  return useSiteStore((state) => sectionVisible(state.sections, id));
}
