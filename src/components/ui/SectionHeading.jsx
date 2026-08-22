import Reveal from './Reveal.jsx';

/**
 * Titre de section : pastille de rubrique, titre avec fin en dégradé laiton, chapô.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  className = '',
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const label = eyebrow ?? index;

  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      {label ? (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {label}
        </span>
      ) : null}

      <h2 className="max-w-3xl text-3xl font-bold leading-[1.12] sm:text-4xl">
        {title}
        {highlight ? <span className="text-gradient-brass"> {highlight}</span> : null}
      </h2>

      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </Reveal>
  );
}
