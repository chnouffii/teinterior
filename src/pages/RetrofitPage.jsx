import PageHeader from '../components/layout/PageHeader.jsx';
import Retrofit from '../components/sections/Retrofit.jsx';
import CtaBand from '../components/sections/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function RetrofitPage() {
  usePageMeta({
    title: 'Rétrofit CarPlay & Android Auto sans fil | Teintérior',
    description:
      'Intégration Apple CarPlay et Android Auto dans votre écran d’origine, sans altérer le système du véhicule. Configurateur de compatibilité et tarif en ligne.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Rétrofit CarPlay"
        title="CarPlay et Android Auto,"
        highlight="sans toucher à l’origine"
        description="Nous intégrons Apple CarPlay et Android Auto sans fil directement dans votre écran d’usine. Molette, boutons au volant, caméras et enceintes d’origine restent intacts — et tout est réversible en trente minutes."
      />
      <Retrofit hideHeading />
      <CtaBand
        title="Votre configuration n’apparaît pas ?"
        text="Envoyez-nous une photo de votre écran et de la référence de votre autoradio : nous validons la compatibilité exacte sous 24 h ouvrées."
        primaryLabel="Faire vérifier ma voiture"
      />
    </>
  );
}
