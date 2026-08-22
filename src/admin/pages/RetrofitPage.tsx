import { Bloc, ChiffresCles, ListeDeTextes, ListeEditable } from '../components/Editors';
import { useSiteStore } from '../../store/siteStore';

/**
 * Contenus de la page « Rétrofit CarPlay » : chiffres, déroulé de
 * l'intervention et liste des fonctions d'origine conservées.
 *
 * Le catalogue de compatibilité (marque → modèle → système) a son propre écran
 * dans Prestations, il n'est pas repris ici.
 */
export default function RetrofitAdminPage() {
  const facts = useSiteStore((state) => state.retrofitFacts);
  const process = useSiteStore((state) => state.retrofitProcess);
  const keeps = useSiteStore((state) => state.retrofitKeeps);
  const setSection = useSiteStore((state) => state.setSection);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Page Rétrofit CarPlay</h1>
        <p className="mt-1 text-xs text-faint">
          Chiffres annoncés, déroulé de l’intervention et garanties d’origine.
        </p>
      </header>

      <Bloc
        titre="Chiffres annoncés"
        aide="La bande de quatre chiffres en haut de la page rétrofit."
      >
        <ChiffresCles
          items={facts as { label: string; value: string }[]}
          onChange={(suivant) => setSection('retrofitFacts', suivant as never)}
        />
      </Bloc>

      <Bloc
        titre="Déroulé de l’intervention"
        aide="Les étapes s’affichent dans cet ordre, avec leur durée. C’est ce détail qui rassure le client sur le sérieux de la pose."
      >
        <ListeEditable
          items={process as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('retrofitProcess', suivant as never)}
          titreItem={(item, i) => `${String(item.step || i + 1)} — ${String(item.label || 'étape')}`}
          ajoutLabel="Ajouter une étape"
          nouvelItem={() => ({
            step: String(process.length + 1).padStart(2, '0'),
            label: '',
            detail: '',
            duration: '',
          })}
          champs={[
            { cle: 'step', label: 'Numéro', largeur: 2 },
            { cle: 'label', label: 'Étape', largeur: 6 },
            { cle: 'duration', label: 'Durée', largeur: 4, aide: 'ex. 25 min' },
            { cle: 'detail', label: 'Détail', type: 'zone' },
          ]}
        />
      </Bloc>

      <Bloc
        titre="Ce qui reste d’origine"
        aide="La liste des fonctions du véhicule qui continuent de marcher après la pose."
      >
        <ListeDeTextes
          items={keeps as string[]}
          placeholder="ex. Commandes au volant et micro de série"
          onChange={(suivant) => setSection('retrofitKeeps', suivant as never)}
          ajoutLabel="Ajouter une fonction conservée"
        />
      </Bloc>
    </div>
  );
}
