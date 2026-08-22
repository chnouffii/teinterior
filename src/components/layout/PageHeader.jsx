import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import { ROUTES } from '../../data/site.js';

/** En-tête de page : fil d'Ariane, titre H1 avec accent laiton, chapô. */
export default function PageHeader({ eyebrow, title, highlight, description, meta = [], children }) {
  return (
    <header className="relative overflow-hidden pt-28 pb-14 lg:pt-36 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-carbon bg-grid [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-radial-brass blur-3xl" />

      <div className="container-x relative">
        <Reveal>
          <nav aria-label="Fil d’Ariane" className="flex items-center gap-1.5 text-xs text-faint">
            <Link
              to={ROUTES.home}
              className="-my-2 inline-flex items-center py-2 transition-colors hover:text-accent-soft"
            >
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-medium text-muted">{eyebrow}</span>
          </nav>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-5xl">
            {title}
            {highlight ? <span className="block text-gradient-brass">{highlight}</span> : null}
          </h1>
        </Reveal>

        {description ? (
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
          </Reveal>
        ) : null}

        {meta.length > 0 ? (
          <Reveal delay={200}>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="label-xs">{item.label}</dt>
                  <dd className="num mt-1 font-display text-lg font-bold text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {children ? <Reveal delay={240} className="mt-8">{children}</Reveal> : null}
      </div>
    </header>
  );
}
