import type { ReactNode } from 'react';

export function Field({
  label,
  hint,
  className = '',
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-faint">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`field resize-y ${props.className ?? ''}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`field appearance-none ${props.className ?? ''}`} />;
}

export function AdminButton({
  variant = 'primary',
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const variants = {
    primary: 'bg-accent text-accent-on hover:bg-accent-soft',
    ghost: 'border border-white/10 text-muted hover:border-white/20 hover:text-fg',
    danger: 'border border-signal-danger/40 text-signal-danger hover:bg-signal-danger/10',
  } as const;

  return (
    <button
      {...rest}
      className={`inline-flex min-h-[38px] items-center justify-center gap-2 rounded-md px-3.5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}

/**
 * Interrupteur d'affichage.
 *
 * Une case à cocher native aurait suffi fonctionnellement, mais l'état « ce
 * bloc est-il visible sur le site » doit se lire d'un coup d'œil depuis le
 * titre de la section, sans avoir à déplier quoi que ce soit.
 */
export function Bascule({
  checked,
  onChange,
  labelActif = 'Affiché',
  labelInactif = 'Masqué',
}: {
  checked: boolean;
  onChange: (valeur: boolean) => void;
  labelActif?: string;
  labelInactif?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
        checked
          ? 'border-signal-ok/40 bg-signal-ok/10 text-signal-ok'
          : 'border-white/10 text-faint hover:border-white/20 hover:text-muted'
      }`}
    >
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-signal-ok/60' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
            checked ? 'left-3.5' : 'left-0.5'
          }`}
        />
      </span>
      {checked ? labelActif : labelInactif}
    </button>
  );
}
