import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import { ROUTES } from '../../data/site.js';

/**
 * En-tête de page : fil d'Ariane, titre H1 et chapô.
 *
 * Le titre et le chapô sont posés sur deux colonnes à partir de `lg` : la page
 * occupe toute sa largeur au lieu de laisser la moitié droite vide, et le filet
 * de bas d'en-tête sépare franchement l'en-tête du contenu.
 */
export default function PageHeader({ eyebrow, title, highlight, description, meta = [], children }) {
  return (
    <header className="pt-24 lg:pt-28">
      <div className="container-x">
        <Reveal>
          <nav aria-label="Fil d’Ariane" className="flex items-center gap-1.5 text-xs text-faint">
            <Link
              to={ROUTES.home}
              className="-my-2 inline-flex items-center py-2 transition-colors hover:text-accent"
            >
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-medium text-muted">{eyebrow}</span>
          </nav>
        </Reveal>

        <div className="mt-5 grid gap-x-12 gap-y-5 lg:grid-cols-12 lg:items-end">
          <Reveal variante="titre" className="lg:col-span-7">
            <h1 className="text-3xl font-extrabold leading-[1.06] sm:text-4xl lg:text-[2.75rem]">
              {title}
              {highlight ? <span className="block text-muted">{highlight}</span> : null}
            </h1>
          </Reveal>

          {description ? (
            <Reveal delay={80} className="lg:col-span-5">
              <p className="max-w-prose text-[15px] leading-relaxed text-muted">{description}</p>
            </Reveal>
          ) : null}
        </div>

        {meta.length > 0 ? (
          <Reveal delay={140}>
            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="label-xs">{item.label}</dt>
                  <dd className="num mt-1 font-display text-lg font-bold text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {children ? (
          <Reveal delay={140} className="mt-7">
            {children}
          </Reveal>
        ) : null}

        <div className="rule mt-9 lg:mt-11" />
      </div>
    </header>
  );
}
