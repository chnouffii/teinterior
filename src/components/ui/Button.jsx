const VARIANTS = {
  primary:
    'bg-gradient-to-br from-brass-light via-brass to-brass-deep text-carbon-950 shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'border border-white/15 bg-white/[0.04] text-white backdrop-blur hover:border-brass/50 hover:bg-white/[0.08]',
  ghost: 'text-slate-300 hover:text-white',
  ice: 'bg-gradient-to-br from-ice via-ice to-ice-deep text-carbon-950 shadow-glow-ice hover:brightness-110',
  outline:
    'border border-brass/40 text-brass-light hover:border-brass hover:bg-brass/10',
};

const SIZES = {
  sm: 'min-h-[44px] px-4 py-2.5 text-xs',
  md: 'min-h-[46px] px-5 py-3 text-sm',
  lg: 'min-h-[52px] px-7 py-4 text-sm sm:text-base',
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
      className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full
        font-semibold tracking-tight transition-all duration-300 active:scale-[0.97]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" /> : null}
      <span>{children}</span>
      {IconRight ? (
        <IconRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2.2}
          aria-hidden="true"
        />
      ) : null}
    </Tag>
  );
}
