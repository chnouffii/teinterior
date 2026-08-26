import { useEffect, useRef, useState } from 'react';

/**
 * Enveloppe un bloc et déclenche son apparition à l'entrée dans le viewport.
 *
 * `variante` choisit la manière d'apparaître selon la nature du contenu —
 * « titre », « carte », « image », « trait » — plutôt que d'appliquer le même
 * fondu à tout. Voir les classes correspondantes dans `index.css`.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  variante = null,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${variante ? `reveal-${variante}` : ''} ${
        visible ? 'is-visible' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
