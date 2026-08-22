import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import { ROUTES } from '../../data/site.js';

/** En-tête de page : fil d'Ariane, titre H1, chapô, encarts facultatifs. */
export default function PageHeader({ eyebrow, title, description, meta = [], children }) {
  return (
    <header className="border-b border-ink-800 pt-24 pb-10 lg:pt-28 lg:pb-12">
      <div className="container-x">
        <Reveal>
          <nav aria-label="Fil d’Ariane" className="flex items-center gap-1.5 text-xs text-faint">
            <Link to={ROUTES.home} className="-my-2 inline-flex items-center py-2 transition-colors hover:text-accent">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-muted">{eyebrow}</span>
          </nav>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-[1.1] sm:text-4xl">
            {title}
          </h1>
        </Reveal>

        {description ? (
          <Reveal delay={120}>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {description}
            </p>
          </Reveal>
        ) : null}

        {meta.length > 0 ? (
          <Reveal delay={160}>
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="label-xs">{item.label}</dt>
                  <dd className="num mt-1 text-sm font-semibold text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {children ? <Reveal delay={200} className="mt-7">{children}</Reveal> : null}
      </div>
    </header>
  );
}
