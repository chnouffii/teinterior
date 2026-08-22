import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo.jsx';
import { BRAND, CONTACT, LEGAL_LINKS, NAV_LINKS } from '../../data/site.js';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-carbon-950">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" />

      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-300">
            Atelier indépendant d’esthétique automobile, de rétrofit multimédia et de courtage
            de véhicules. Un seul véhicule à la fois, du soin, et des comptes rendus photo à
            chaque étape.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {CONTACT.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                className="tap inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-brass/40 hover:text-white"
              >
                {social.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </h3>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.path}
                  className="inline-flex min-h-[40px] items-center text-sm text-slate-300 transition-colors hover:text-brass-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            L’atelier
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
              <span>
                {CONTACT.address.street}
                <br />
                {CONTACT.address.zone}
                <br />
                {CONTACT.address.city}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
              <a
                href={CONTACT.phoneHref}
                className="inline-flex min-h-[40px] items-center transition-colors hover:text-white"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
              <a
                href={CONTACT.emailHref}
                className="inline-flex min-h-[40px] items-center transition-colors hover:text-white"
              >
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Horaires
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {CONTACT.hours.map((slot) => (
              <li key={slot.day} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-brass/70" aria-hidden="true" />
                  {slot.day}
                </span>
                <span className="font-medium text-white">{slot.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline" />

      <div className="container-x flex flex-col gap-4 py-7 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {BRAND.name} — SIRET 902 481 337 00018 — TVA FR38902481337. Tous droits réservés.
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                to={link.path}
                className="inline-flex min-h-[40px] items-center transition-colors hover:text-brass-light"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
