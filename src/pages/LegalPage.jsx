import PageHeader from '../components/layout/PageHeader.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { BRAND, COMPANY, CONTACT } from '../data/site.js';

const CORE_SECTIONS = [
  {
    id: 'mentions',
    title: 'Mentions légales',
    blocks: [
      {
        subtitle: 'Éditeur du site',
        lines: [
          `${COMPANY.legalName} — société par actions simplifiée au capital de ${COMPANY.capital}`,
          `SIRET ${COMPANY.siret} — ${COMPANY.rcs} — TVA intracommunautaire ${COMPANY.vat}`,
          `Siège social : ${CONTACT.address.street}, ${CONTACT.address.zone}, ${CONTACT.address.city}`,
          `Téléphone : ${CONTACT.phone} — Email : ${CONTACT.email}`,
          COMPANY.director,
        ],
      },
      { subtitle: 'Hébergement', lines: [COMPANY.host] },
      {
        subtitle: 'Assurance professionnelle',
        lines: [COMPANY.insurance, 'Couverture géographique : France métropolitaine.'],
      },
      {
        subtitle: 'Propriété intellectuelle',
        lines: [
          `L’ensemble des contenus de ce site (textes, visuels, illustrations, identité ${BRAND.name}) est protégé par le droit d’auteur.`,
          'Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.',
        ],
      },
    ],
  },
  {
    id: 'cgv',
    title: 'Conditions générales de vente',
    blocks: [
      {
        subtitle: 'Devis et réservation',
        lines: [
          'Tout devis est gratuit, établi sur la base des informations transmises par le client et valable 30 jours.',
          'Le tarif définitif est confirmé après examen du véhicule à l’atelier. Aucun acompte n’est demandé à la réservation.',
        ],
      },
      {
        subtitle: 'Prestations esthétiques',
        lines: [
          'Les durées annoncées sont indicatives et dépendent de l’état réel du véhicule.',
          'Les protections céramique sont garanties 3 ans sous réserve du respect du protocole d’entretien remis au client.',
          'Le teintage est réalisé conformément à la réglementation en vigueur : les vitres avant conservent au minimum 70 % de transmission lumineuse.',
        ],
      },
      {
        subtitle: 'Rétrofit multimédia',
        lines: [
          'Les installations sont réversibles et garanties 2 ans, pièces et main-d’œuvre.',
          'La garantie ne couvre pas les dommages consécutifs à une intervention réalisée par un tiers sur le système multimédia.',
        ],
      },
      {
        subtitle: 'Dépôt-vente et sourcing',
        lines: [
          'Le mandat de vente est conclu par écrit et précise le prix plancher accepté par le propriétaire.',
          'La commission n’est due qu’en cas de vente effective. Aucun frais n’est facturé si le véhicule n’est pas vendu.',
        ],
      },
      {
        subtitle: 'Paiement et rétractation',
        lines: [
          'Le règlement s’effectue à la restitution du véhicule, par carte, virement ou espèces dans la limite légale.',
          'Les prestations étant réalisées sur rendez-vous dans nos locaux, le droit de rétractation à distance ne s’applique pas une fois la prestation exécutée.',
        ],
      },
    ],
  },
];

const SECTIONS = [
  ...CORE_SECTIONS,
  {
    id: 'confidentialite',
    title: 'Politique de confidentialité',
    blocks: [
      {
        subtitle: 'Données collectées',
        lines: [
          'Les formulaires du site collectent : nom, téléphone, email, immatriculation (facultative), informations sur le véhicule et pièces jointes éventuelles.',
          'Ces données servent uniquement à traiter votre demande de devis, d’estimation ou de rendez-vous.',
        ],
      },
      {
        subtitle: 'Conservation et destinataires',
        lines: [
          'Les données sont conservées 3 ans à compter du dernier contact, puis supprimées.',
          'Elles sont traitées exclusivement par l’équipe Teintérior et ne font l’objet d’aucune cession à des tiers.',
        ],
      },
      {
        subtitle: 'Vos droits',
        lines: [
          `Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et d’opposition, exerçable à l’adresse ${CONTACT.email}.`,
          'Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: 'Gestion des cookies',
    blocks: [
      {
        subtitle: 'Cookies utilisés',
        lines: [
          'Ce site ne dépose aucun cookie publicitaire ni traceur tiers.',
          'Seul le stockage technique strictement nécessaire au fonctionnement de la navigation est utilisé, sans consentement requis.',
        ],
      },
      {
        subtitle: 'Mesure d’audience',
        lines: [
          'Aucune solution de mesure d’audience n’est active à ce jour. Toute future mise en place serait précédée d’une bannière de consentement.',
        ],
      },
    ],
  },
];

export default function LegalPage() {
  usePageMeta({
    title: 'Mentions légales, CGV et confidentialité | Teintérior',
    description:
      'Mentions légales, conditions générales de vente, politique de confidentialité et gestion des cookies de l’atelier Teintérior.',
  });

  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title="Mentions légales"
        highlight="& conditions"
        description="Éditeur du site, conditions générales de vente par pôle d’activité, traitement de vos données personnelles et politique de cookies."
      />

      <section className="pb-20 lg:pb-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <nav aria-label="Sommaire" className="lg:col-span-3">
            <ul className="sticky top-28 space-y-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-[44px] items-center rounded-xl border border-white/5 bg-carbon-900/50 px-4 text-sm text-slate-300 transition-colors hover:border-brass/40 hover:text-brass-light"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-10 lg:col-span-9">
            {SECTIONS.map((section) => (
              <Reveal
                key={section.id}
                id={section.id}
                as="article"
                className="panel scroll-mt-28 p-7 sm:p-9"
              >
                <h2 className="text-xl font-bold sm:text-2xl">{section.title}</h2>

                <div className="mt-6 space-y-7">
                  {section.blocks.map((block) => (
                    <div key={block.subtitle}>
                      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-light">
                        {block.subtitle}
                      </h3>
                      <div className="mt-3 space-y-2">
                        {block.lines.map((line) => (
                          <p key={line} className="text-sm leading-relaxed text-slate-300">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}

            <p className="text-xs text-slate-400">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}. Ces documents sont
              fournis à titre d’exemple et doivent être validés par un conseil juridique avant mise
              en ligne.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
