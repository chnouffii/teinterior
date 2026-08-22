import { useState } from 'react';
import { Save } from 'lucide-react';
import { AdminButton, Field, TextArea, TextInput } from '../components/Field';
import { toast } from '../components/toast';
import { useSiteStore } from '../../store/siteStore';
import { useAuthStore } from '../../store/authStore';

export default function ContentPage() {
  const hero = useSiteStore((state) => state.hero);
  const workshop = useSiteStore((state) => state.workshop);
  const contact = useSiteStore((state) => state.contact);
  const beforeAfter = useSiteStore((state) => state.beforeAfter);
  const updateHero = useSiteStore((state) => state.updateHero);
  const updateWorkshop = useSiteStore((state) => state.updateWorkshop);
  const updateContact = useSiteStore((state) => state.updateContact);
  const updateBeforeAfter = useSiteStore((state) => state.updateBeforeAfter);
  const resetAll = useSiteStore((state) => state.resetAll);

  const email = useAuthStore((state) => state.email);
  const changePassword = useAuthStore((state) => state.changePassword);
  const changeEmail = useAuthStore((state) => state.changeEmail);

  const [heroDraft, setHeroDraft] = useState(hero);
  const [workshopDraft, setWorkshopDraft] = useState(workshop);
  const [contactDraft, setContactDraft] = useState(contact);
  const [accountEmail, setAccountEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-lg font-semibold text-fg">Contenu du site</h1>
        <p className="mt-1 text-xs text-faint">
          Textes d’accroche, présentation de l’atelier, coordonnées et légendes avant / après.
        </p>
      </div>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold text-fg">Accroche (page d’accueil)</h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sur-titre">
              <TextInput
                value={heroDraft.kicker}
                onChange={(event) => setHeroDraft({ ...heroDraft, kicker: event.target.value })}
              />
            </Field>
            <Field label="Bouton principal">
              <TextInput
                value={heroDraft.primaryCta}
                onChange={(event) => setHeroDraft({ ...heroDraft, primaryCta: event.target.value })}
              />
            </Field>
          </div>
          <Field label="Titre">
            <TextArea
              rows={2}
              value={heroDraft.title}
              onChange={(event) => setHeroDraft({ ...heroDraft, title: event.target.value })}
            />
          </Field>
          <Field label="Sous-titre">
            <TextArea
              rows={3}
              value={heroDraft.subtitle}
              onChange={(event) => setHeroDraft({ ...heroDraft, subtitle: event.target.value })}
            />
          </Field>

          <div>
            <span className="field-label">Chiffres clés</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {heroDraft.facts.map((fact, index) => (
                <div key={fact.label} className="flex gap-2">
                  <TextInput
                    value={fact.value}
                    onChange={(event) => {
                      const facts = [...heroDraft.facts];
                      facts[index] = { ...fact, value: event.target.value };
                      setHeroDraft({ ...heroDraft, facts });
                    }}
                    className="w-24 shrink-0"
                  />
                  <TextInput
                    value={fact.label}
                    onChange={(event) => {
                      const facts = [...heroDraft.facts];
                      facts[index] = { ...fact, label: event.target.value };
                      setHeroDraft({ ...heroDraft, facts });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <AdminButton
            onClick={() => {
              updateHero(heroDraft);
              toast('Accroche enregistrée.');
            }}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Enregistrer l’accroche
          </AdminButton>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold text-fg">Présentation de l’atelier</h2>
        <div className="mt-4 space-y-4">
          <Field label="Intitulé">
            <TextInput
              value={workshopDraft.title}
              onChange={(event) => setWorkshopDraft({ ...workshopDraft, title: event.target.value })}
            />
          </Field>
          <Field label="Introduction">
            <TextArea
              rows={3}
              value={workshopDraft.intro}
              onChange={(event) => setWorkshopDraft({ ...workshopDraft, intro: event.target.value })}
            />
          </Field>

          <div className="space-y-3">
            {workshopDraft.points.map((point, index) => (
              <div key={point.label} className="grid gap-2 sm:grid-cols-[12rem,1fr]">
                <TextInput
                  value={point.label}
                  onChange={(event) => {
                    const points = [...workshopDraft.points];
                    points[index] = { ...point, label: event.target.value };
                    setWorkshopDraft({ ...workshopDraft, points });
                  }}
                />
                <TextInput
                  value={point.detail}
                  onChange={(event) => {
                    const points = [...workshopDraft.points];
                    points[index] = { ...point, detail: event.target.value };
                    setWorkshopDraft({ ...workshopDraft, points });
                  }}
                />
              </div>
            ))}
          </div>

          <AdminButton
            onClick={() => {
              updateWorkshop(workshopDraft);
              toast('Présentation enregistrée.');
            }}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Enregistrer la présentation
          </AdminButton>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold text-fg">Coordonnées et horaires</h2>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Téléphone">
              <TextInput
                value={contactDraft.phone}
                onChange={(event) =>
                  setContactDraft({
                    ...contactDraft,
                    phone: event.target.value,
                    phoneHref: `tel:+33${event.target.value.replace(/\D/g, '').slice(1)}`,
                  })
                }
              />
            </Field>
            <Field label="Email">
              <TextInput
                value={contactDraft.email}
                onChange={(event) =>
                  setContactDraft({
                    ...contactDraft,
                    email: event.target.value,
                    emailHref: `mailto:${event.target.value}`,
                  })
                }
              />
            </Field>
            <Field label="Rue">
              <TextInput
                value={contactDraft.address.street}
                onChange={(event) =>
                  setContactDraft({
                    ...contactDraft,
                    address: { ...contactDraft.address, street: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="Complément">
              <TextInput
                value={contactDraft.address.zone}
                onChange={(event) =>
                  setContactDraft({
                    ...contactDraft,
                    address: { ...contactDraft.address, zone: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="Code postal et ville">
              <TextInput
                value={contactDraft.address.city}
                onChange={(event) =>
                  setContactDraft({
                    ...contactDraft,
                    address: { ...contactDraft.address, city: event.target.value },
                  })
                }
              />
            </Field>
            <Field label="Lien WhatsApp">
              <TextInput
                value={contactDraft.whatsapp}
                onChange={(event) =>
                  setContactDraft({ ...contactDraft, whatsapp: event.target.value })
                }
              />
            </Field>
          </div>

          <div>
            <span className="field-label">Horaires d’ouverture</span>
            <div className="space-y-2">
              {contactDraft.hours.map((slot, index) => (
                <div key={slot.day} className="grid gap-2 sm:grid-cols-2">
                  <TextInput
                    value={slot.day}
                    onChange={(event) => {
                      const hours = [...contactDraft.hours];
                      hours[index] = { ...slot, day: event.target.value };
                      setContactDraft({ ...contactDraft, hours });
                    }}
                  />
                  <TextInput
                    value={slot.value}
                    onChange={(event) => {
                      const hours = [...contactDraft.hours];
                      hours[index] = { ...slot, value: event.target.value };
                      setContactDraft({ ...contactDraft, hours });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <AdminButton
            onClick={() => {
              updateContact(contactDraft);
              toast('Coordonnées enregistrées.');
            }}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Enregistrer les coordonnées
          </AdminButton>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold text-fg">Galerie avant / après</h2>
        <p className="mt-1 text-xs text-faint">
          Renseignez une URL d’image pour remplacer l’illustration vectorielle de repli.
        </p>

        <div className="mt-4 space-y-4">
          {beforeAfter.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-ink-850 p-4">
              <h3 className="text-xs font-semibold text-fg">
                {item.label} — {item.vehicle}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Image avant (URL)">
                  <TextInput
                    defaultValue={item.beforeImage ?? ''}
                    placeholder="https://…/avant.jpg"
                    onBlur={(event) => updateBeforeAfter(item.id, { beforeImage: event.target.value })}
                  />
                </Field>
                <Field label="Image après (URL)">
                  <TextInput
                    defaultValue={item.afterImage ?? ''}
                    placeholder="https://…/apres.jpg"
                    onBlur={(event) => updateBeforeAfter(item.id, { afterImage: event.target.value })}
                  />
                </Field>
                <Field label="Légende avant">
                  <TextInput
                    defaultValue={item.beforeCaption}
                    onBlur={(event) =>
                      updateBeforeAfter(item.id, { beforeCaption: event.target.value })
                    }
                  />
                </Field>
                <Field label="Légende après">
                  <TextInput
                    defaultValue={item.afterCaption}
                    onBlur={(event) =>
                      updateBeforeAfter(item.id, { afterCaption: event.target.value })
                    }
                  />
                </Field>
                <Field label="Commentaire technique" className="sm:col-span-2">
                  <TextArea
                    rows={2}
                    defaultValue={item.summary}
                    onBlur={(event) => updateBeforeAfter(item.id, { summary: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-faint">
            Les champs de cette section sont enregistrés à la sortie du champ.
          </p>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-sm font-semibold text-fg">Compte administrateur</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Email de connexion">
            <TextInput
              value={accountEmail}
              onChange={(event) => setAccountEmail(event.target.value)}
            />
          </Field>
          <div className="flex items-end">
            <AdminButton
              variant="ghost"
              onClick={() => {
                changeEmail(accountEmail);
                toast('Email de connexion mis à jour.');
              }}
            >
              Mettre à jour l’email
            </AdminButton>
          </div>

          <Field label="Mot de passe actuel">
            <TextInput
              type="password"
              value={currentPassword}
              autoComplete="current-password"
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </Field>
          <Field label="Nouveau mot de passe" hint="10 caractères minimum">
            <TextInput
              type="password"
              value={nextPassword}
              autoComplete="new-password"
              onChange={(event) => setNextPassword(event.target.value)}
            />
          </Field>

          <div className="sm:col-span-2">
            <AdminButton
              onClick={async () => {
                const result = await changePassword(currentPassword, nextPassword);
                if (!result.ok) {
                  toast(result.error ?? 'Changement refusé.', 'danger');
                  return;
                }
                setCurrentPassword('');
                setNextPassword('');
                toast('Mot de passe modifié.');
              }}
            >
              Changer le mot de passe
            </AdminButton>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-signal-danger/30 bg-signal-danger/5 p-5">
        <h2 className="text-sm font-semibold text-fg">Réinitialisation</h2>
        <p className="mt-1 text-xs text-faint">
          Restaure le jeu de données de démonstration : véhicules, prestations, contenus et
          demandes. Les modifications enregistrées sont perdues.
        </p>
        <AdminButton
          variant="danger"
          className="mt-4"
          onClick={() => {
            resetAll();
            toast('Données de démonstration restaurées.', 'info');
          }}
        >
          Réinitialiser les données
        </AdminButton>
      </section>
    </div>
  );
}
