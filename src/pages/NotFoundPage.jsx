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
    <section className="relative overflow-hidden py-32 lg:py-40">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-radial-brass blur-3xl" />

      <div className="container-x relative max-w-2xl text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brass/30 bg-brass/10">
          <Compass className="h-6 w-6 text-brass" aria-hidden="true" />
        </span>

        <p className="mt-8 font-display text-6xl font-extrabold text-gradient-brass">404</p>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Cette page a quitté l’atelier</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          {message ?? 'La page demandée n’existe pas ou a été déplacée.'} Voici par où reprendre :
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-semibold text-slate-300 transition-colors hover:border-brass/40 hover:text-white"
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
