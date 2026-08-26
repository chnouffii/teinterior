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
    <div className={`flex flex-col ${alignment} ${className}`}>
      {label ? (
        <div className="mb-3 flex flex-col gap-2">
          <Reveal>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {label}
            </span>
          </Reveal>
          {/* La graduation remplace le filet uniforme : elle se trace de gauche
              à droite et signe la section. */}
          <Reveal
            variante="trait"
            delay={60}
            className={align === 'center' ? 'self-center' : ''}
          >
            <span className="graduation block" aria-hidden="true" />
          </Reveal>
        </div>
      ) : null}

      <Reveal variante="titre" delay={label ? 90 : 0}>
        <h2 className="max-w-3xl text-2xl font-bold leading-[1.15] sm:text-3xl">
          {title}
          {highlight ? <span> {highlight}</span> : null}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={label ? 180 : 90}>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
