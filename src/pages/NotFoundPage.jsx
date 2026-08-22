import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { NAV_LINKS, ROUTES } from '../data/site.js';
import usePageMeta from '../hooks/usePageMeta.js';

export default function NotFoundPage({ message }) {
  usePageMeta({
    title: 'Page introuvable | Teintérior',
    description: 'La page demandée n’existe pas ou a été déplacée.',
  });

  return (
    <section className="py-28 lg:py-36">

      <div className="container-x max-w-2xl text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-ink-900">
          <Compass className="h-6 w-6 text-accent" aria-hidden="true" />
        </span>

        <p className="num mt-8 text-5xl font-extrabold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Cette page a quitté l’atelier</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {message ?? 'La page demandée n’existe pas ou a été déplacée.'} Voici par où reprendre :
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className="inline-flex min-h-[44px] items-center rounded-2xl border border-white/10 bg-ink-850 px-4 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button as={Link} to={ROUTES.home} size="lg" icon={ArrowLeft} className="mt-8">
          Revenir à l’accueil
        </Button>
      </div>
    </section>
  );
}
