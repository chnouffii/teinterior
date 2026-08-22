import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, ShieldAlert } from 'lucide-react';
import { AdminButton, Field, TextInput } from '../components/Field';
import { DEFAULT_ADMIN_EMAIL, useAuthStore } from '../../store/authStore';
import usePageMeta from '../../hooks/usePageMeta.js';
import Toaster from '../components/Toaster';
import { toast } from '../components/toast';

export default function LoginPage() {
  usePageMeta({
    title: 'Connexion — Administration Teintérior',
    description: 'Accès réservé à l’équipe de l’atelier.',
  });

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await login(email, password);
    setPending(false);

    if (!result.ok) {
      setError(result.error ?? 'Connexion refusée.');
      return;
    }

    toast('Connexion réussie.');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-accent-on">
            T
          </span>
          <span className="text-sm font-semibold text-fg">Teintérior — administration</span>
        </Link>

        <form onSubmit={handleSubmit} className="panel p-6">
          <h1 className="text-base font-semibold text-fg">Connexion</h1>
          <p className="mt-1 text-xs text-faint">
            Accès réservé à l’équipe de l’atelier. Session valable 8 heures.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Email">
              <TextInput
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </Field>

            <Field label="Mot de passe">
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
          </div>

          {error ? (
            <p className="mt-4 flex items-start gap-2 rounded-md border border-signal-danger/40 bg-signal-danger/10 px-3 py-2 text-xs text-signal-danger">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}

          <AdminButton type="submit" disabled={pending} className="mt-6 w-full">
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            )}
            Se connecter
          </AdminButton>

          <p className="mt-5 rounded-md border border-white/10 bg-ink-850 px-3 py-2.5 text-[11px] leading-relaxed text-faint">
            Démonstration — identifiants par défaut :{' '}
            <span className="num text-muted">{DEFAULT_ADMIN_EMAIL}</span> /{' '}
            <span className="num text-muted">teinterior2026</span>. Le contrôle d’accès est côté
            client tant qu’aucune API n’est branchée : à remplacer par une authentification serveur
            avant toute mise en ligne publique.
          </p>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-faint hover:text-accent">
          ← Retour au site
        </Link>
      </div>

      <Toaster />
    </div>
  );
}
