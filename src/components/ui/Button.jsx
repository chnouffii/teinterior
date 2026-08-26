const VARIANTS = {
  primary: 'bg-accent text-accent-on hover:bg-accent-soft',
  secondary: 'border border-white/10 bg-ink-850 text-fg hover:border-white/20 hover:bg-ink-800',
  outline: 'border border-accent/50 text-accent hover:border-accent hover:bg-accent/10',
  ghost: 'text-muted hover:text-fg',
};

const SIZES = {
  sm: 'min-h-[40px] px-3.5 text-xs',
  md: 'min-h-[44px] px-4 text-sm',
  lg: 'min-h-[48px] px-6 text-sm',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded
        font-semibold tracking-tight transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-40
        ${variant === 'primary' ? 'balayage' : ''}
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" /> : null}
      <span>{children}</span>
      {IconRight ? (
        <IconRight
          className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
    </Tag>
  );
}
