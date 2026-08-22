import Reveal from './Reveal.jsx';

/** Titre de section : numéro de repère, titre, chapô. Aucun effet décoratif. */
export default function SectionHeading({ index, title, description, className = '' }) {
  return (
    <Reveal className={className}>
      {index ? (
        <span className="num mb-3 block text-xs font-semibold text-accent">{index}</span>
      ) : null}
      <h2 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
