import { Link } from 'react-router-dom';
import Logo from '../ui/Logo.jsx';
import { LEGAL_LINKS } from '../../data/site.js';
import { VILLES, cheminVille } from '../../data/villes.js';
import { useSiteStore } from '../../store/siteStore';

export default function Footer() {
  const contact = useSiteStore((state) => state.contact);
  const navLinks = useSiteStore((state) => state.navLinks);
  const brand = useSiteStore((state) => state.brand);
  const company = useSiteStore((state) => state.company);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Atelier indépendant : esthétique automobile, rétrofit multimédia et courtage de
            véhicules. Un seul véhicule à la fois, compte rendu photo à chaque étape.
          </p>
          <p className="mt-4 text-xs text-faint">
            {brand.baseline} · depuis {brand.since}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {contact.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                className="tap inline-flex items-center rounded-md border border-white/10 px-3 text-xs text-muted transition-colors hover:border-white/20 hover:text-fg"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <h2 className="label-xs">Navigation</h2>
          <ul className="mt-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.path}
                  className="inline-flex min-h-[36px] items-center text-sm text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="label-xs">Atelier</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-muted">
            <p>
              {contact.address.street}
              <br />
              {contact.address.zone ? (
                <>
                  {contact.address.zone}
                  <br />
                </>
              ) : null}
              {contact.address.city}
            </p>
            <p>
              {contact.phones.map((line) => (
                <span key={line.id} className="block">
                  <a
                    href={line.href}
                    className="num inline-flex min-h-[36px] items-center transition-colors hover:text-accent"
                  >
                    {line.number}
                  </a>
                </span>
              ))}
              <a
                href={contact.emailHref}
                className="inline-flex min-h-[36px] items-center transition-colors hover:text-accent"
              >
                {contact.email}
              </a>
            </p>
          </address>
        </div>

        <div className="lg:col-span-2">
          <h2 className="label-xs">Horaires</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {contact.hours.map((slot) => (
              <li key={slot.day}>
                <span className="block text-muted">{slot.day}</span>
                <span className="num block text-xs text-faint">{slot.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rule" />

      {/*
        Les pages locales n'existent pour un moteur de recherche que si un lien
        y mène. Le sitemap les déclare, ce bandeau les rend atteignables depuis
        n'importe quelle page du site.
      */}
      <nav aria-label="Zones d’intervention" className="container-x py-5">
        <h2 className="label-xs">Zones d’intervention</h2>
        <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <li>{contact.address.city.replace(/^\d+\s*/, '')}</li>
          {VILLES.map((ville) => (
            <li key={ville.slug} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-faint">
                ·
              </span>
              <Link
                to={cheminVille(ville.slug)}
                className="inline-flex min-h-[36px] items-center transition-colors hover:text-accent"
              >
                {ville.nom}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="rule" />

      <div className="container-x flex flex-col gap-3 py-6 text-xs text-faint md:flex-row md:items-center md:justify-between">
        <p className="num">
          {[`© ${year} ${company.legalName}`, company.siret && `SIRET ${company.siret}`, company.vat && `TVA ${company.vat}`]
            .filter(Boolean)
            .join(' — ')}
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {LEGAL_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                to={link.path}
                className="inline-flex min-h-[36px] items-center transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/admin"
              className="inline-flex min-h-[36px] items-center transition-colors hover:text-accent"
            >
              Espace atelier
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
