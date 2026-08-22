import { Bloc, ChiffresCles, ListeEditable } from '../components/Editors';
import { useSiteStore } from '../../store/siteStore';

/** Page « Vendre sa voiture » : déroulé du dépôt-vente et chiffres associés. */
export default function VendreAdminPage() {
  const pipeline = useSiteStore((state) => state.pipeline);
  const sourcingFacts = useSiteStore((state) => state.sourcingFacts);
  const setSection = useSiteStore((state) => state.setSection);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-lg font-semibold text-fg">Page Vendre sa voiture</h1>
        <p className="mt-1 text-xs text-faint">
          Les étapes du dépôt-vente et les chiffres affichés en dessous.
        </p>
      </header>

      <Bloc
        titre="Déroulé d’un dépôt-vente"
        aide="Les étapes s’affichent dans cet ordre, numérotées automatiquement à l’écran."
      >
        <ListeEditable
          items={pipeline as unknown as Record<string, unknown>[]}
          onChange={(suivant) => setSection('pipeline', suivant as never)}
          titreItem={(item, i) => `${i + 1}. ${String(item.label || 'étape')}`}
          ajoutLabel="Ajouter une étape"
          nouvelItem={() => ({ step: '', label: '', detail: '', duration: '' })}
          champs={[
            { cle: 'label', label: 'Étape', largeur: 7 },
            { cle: 'duration', label: 'Délai', largeur: 5, aide: 'ex. 24 h, 1 à 2 jours' },
            { cle: 'detail', label: 'Détail', type: 'zone' },
          ]}
        />
      </Bloc>

      <Bloc
        titre="Chiffres du dépôt-vente"
        aide="Prix de vente moyen constaté, délai, commission. Comme ailleurs, n’annoncez que ce que vous pouvez justifier."
      >
        <ChiffresCles
          items={sourcingFacts as { label: string; value: string }[]}
          onChange={(suivant) => setSection('sourcingFacts', suivant as never)}
        />
      </Bloc>
    </div>
  );
}
