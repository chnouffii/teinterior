import Reveal from './Reveal.jsx';

/**
 * Titre de section : rubrique en capitales soulignée d'un filet court, puis titre.
 *
 * `highlight` reste accepté pour ne pas casser les appelants, mais s'affiche
 * dans la même couleur que le titre : la couleur d'accent est réservée à la
 * rubrique, et un titre bicolore fait « page d'accueil générée ».
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
        <span className="mb-3 flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {label}
          </span>
          <span className={`h-px w-8 bg-accent/50 ${align === 'center' ? 'self-center' : ''}`} />
        </span>
      ) : null}

      <h2 className="max-w-3xl text-2xl font-bold leading-[1.15] sm:text-3xl">
        {title}
        {highlight ? <span> {highlight}</span> : null}
      </h2>

      {description ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>
      ) : null}
    </Reveal>
  );
}
