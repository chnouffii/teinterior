import { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { AdminButton, Field, TextArea, TextInput } from '../components/Field';
import { toast } from '../components/toast';
import { useSiteStore } from '../../store/siteStore';
import { useAuthStore } from '../../store/authStore';

export default function ContentPage() {
  const hero = useSiteStore((state) => state.hero);
  const workshop = useSiteStore((state) => state.workshop);
  const contact = useSiteStore((state) => state.contact);
  const beforeAfter = useSiteStore((state) => state.beforeAfter);
  const testimonials = useSiteStore((state) => state.testimonials);
  const reviewSummary = useSiteStore((state) => state.reviewSummary);
  const updateTestimonial = useSiteStore((state) => state.updateTestimonial);
  const addTestimonial = useSiteStore((state) => state.addTestimonial);
  const removeTestimonial = useSiteStore((state) => state.removeTestimonial);
  const updateReviewSummary = useSiteStore((state) => state.updateReviewSummary);
  const updateHero = useSiteStore((state) => state.updateHero);
  const updateWorkshop = useSiteStore((state) => state.updateWorkshop);
  const updateContact = useSiteStore((state) => state.updateContact);
  const updateBeforeAfter = useSiteStore((state) => state.updateBeforeAfter);
  const resetAll = useSiteStore((state) => state.resetAll);

  const email = useAuthStore((state) => state.email);

  const [heroDraft, setHeroDraft] = useState(hero);
  const [workshopDraft, setWorkshopDraft] = useState(workshop);
  const [contactDraft, setContactDraft] = useState(contact);

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
            {contactDraft.phones.map((line, index) => (
              <Field key={line.id} label={index === 0 ? 'Téléphone principal' : 'Second téléphone'}>
                <TextInput
                  value={line.number}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '');
                    const phones = [...contactDraft.phones];
                    phones[index] = {
                      ...line,
                      number: event.target.value,
                      href: `tel:+33${digits.slice(1)}`,
                    };
                    setContactDraft({ ...contactDraft, phones });
                  }}
                />
              </Field>
            ))}
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="field-label mb-0">Horaires d’ouverture</span>
              <AdminButton
                variant="ghost"
                onClick={() =>
                  setContactDraft({
                    ...contactDraft,
                    hours: [...contactDraft.hours, { day: '', value: '' }],
                  })
                }
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Ajouter un créneau
              </AdminButton>
            </div>
            <p className="mb-3 mt-1 text-[11px] text-faint">
              Le jour à gauche, les heures à droite. Les horaires alimentent aussi la fiche que
              Google lit sur le site : gardez la forme « 08h30 — 19h00 » pour qu’ils y soient
              compris. Une mention libre comme « Sur rendez-vous » reste possible, elle est
              simplement ignorée par Google.
            </p>
            <div className="space-y-2">
              {/*
                Repéré par la position et non par le libellé : une clé tirée du
                jour changeait à chaque caractère tapé, React remontait le champ
                et le focus était perdu dès la première frappe — renommer un
                jour devenait impossible.
              */}
              {contactDraft.hours.map((slot, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <TextInput
                      value={slot.day}
                      placeholder="Lundi — Vendredi"
                      aria-label={`Jour du créneau ${index + 1}`}
                      onChange={(event) => {
                        const hours = [...contactDraft.hours];
                        hours[index] = { ...slot, day: event.target.value };
                        setContactDraft({ ...contactDraft, hours });
                      }}
                    />
                    <TextInput
                      value={slot.value}
                      placeholder="08h30 — 19h00"
                      aria-label={`Horaires du créneau ${index + 1}`}
                      onChange={(event) => {
                        const hours = [...contactDraft.hours];
                        hours[index] = { ...slot, value: event.target.value };
                        setContactDraft({ ...contactDraft, hours });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    title="Retirer ce créneau"
                    aria-label={`Retirer le créneau ${index + 1}`}
                    onClick={() =>
                      setContactDraft({
                        ...contactDraft,
                        hours: contactDraft.hours.filter((_, i) => i !== index),
                      })
                    }
                    className="flex h-[38px] w-9 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-ink-800 hover:text-signal-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            {contactDraft.hours.length === 0 ? (
              <p className="mt-2 text-[11px] text-signal-warn">
                Aucun horaire : la section disparaîtra du pied de page et de la page Contact.
              </p>
            ) : null}
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
            <div key={item.id} className="rounded-md border border-white/10 bg-ink-850 p-4">
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
        <p className="mt-2 text-xs leading-relaxed text-faint">
          Connecté en tant que <span className="text-muted">{email}</span>.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-faint">
          L’email et le mot de passe se changent sur le serveur, pas ici : c’est ce qui garantit
          qu’aucun identifiant ne circule dans le navigateur. Sur le VPS, générez un nouveau
          condensé puis redémarrez le service —
          <span className="num text-muted"> node server/creer-mot-de-passe.js "nouveau mot de passe"</span>.
          La procédure complète est dans <span className="text-muted">DEPLOIEMENT.md</span>.
        </p>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-fg">Avis clients</h2>
            <p className="mt-1 text-xs text-faint">
              Alimentent la page d’accueil et la page Réalisations. La synthèse ci-dessous est la
              ligne « note / nombre d’avis » affichée au-dessus des témoignages.
            </p>
          </div>
          <AdminButton variant="ghost" onClick={addTestimonial}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter un avis
          </AdminButton>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Note affichée">
            <TextInput
              value={reviewSummary.rating}
              onChange={(event) => updateReviewSummary({ rating: event.target.value })}
            />
          </Field>
          <Field label="Sur">
            <TextInput
              value={reviewSummary.scale}
              onChange={(event) => updateReviewSummary({ scale: event.target.value })}
            />
          </Field>
          <Field label="Nombre d’avis">
            <TextInput
              value={reviewSummary.count}
              onChange={(event) => updateReviewSummary({ count: event.target.value })}
            />
          </Field>
        </div>

        <div className="mt-5 space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-md border border-white/10 bg-ink-900 p-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Nom">
                  <TextInput
                    value={testimonial.name}
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, { name: event.target.value })
                    }
                  />
                </Field>
                <Field label="Ville">
                  <TextInput
                    value={testimonial.city}
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, { city: event.target.value })
                    }
                  />
                </Field>
                <Field label="Prestation">
                  <TextInput
                    value={testimonial.service}
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, { service: event.target.value })
                    }
                  />
                </Field>
                <Field label="Date">
                  <TextInput
                    value={testimonial.date}
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, { date: event.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="mt-3">
                <Field label="Avis">
                  <TextArea
                    rows={3}
                    value={testimonial.text}
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, { text: event.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <Field label="Note sur 5">
                  <TextInput
                    type="number"
                    min={1}
                    max={5}
                    value={String(testimonial.rating)}
                    onChange={(event) =>
                      updateTestimonial(testimonial.id, {
                        rating: Math.min(5, Math.max(1, Number(event.target.value) || 1)),
                      })
                    }
                  />
                </Field>
                <AdminButton
                  variant="danger"
                  onClick={() => {
                    removeTestimonial(testimonial.id);
                    toast('Avis supprimé.', 'info');
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Supprimer
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-signal-danger/30 bg-signal-danger/5 p-5">
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
