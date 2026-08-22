import Reveal from './Reveal.jsx';

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  className = '',
}) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow ? (
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-light">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          {eyebrow}
        </span>
      ) : null}

      <h2 className="max-w-3xl text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-[2.75rem]">
        {title}
        {highlight ? <span className="text-gradient-brass"> {highlight}</span> : null}
      </h2>

      {description ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">{description}</p>
      ) : null}
    </Reveal>
  );
}
