import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../data/site.js';

const QuoteContext = createContext(null);

/**
 * Contexte partagé : n'importe quelle page (formules, configurateur rétrofit,
 * fiche véhicule…) peut pré-remplir le formulaire de devis puis renvoyer
 * l'utilisateur vers la page Contact.
 */
export function QuoteProvider({ children }) {
  const [prefill, setPrefill] = useState(null);
  const navigate = useNavigate();

  const requestQuote = useCallback(
    (payload) => {
      setPrefill({ ...payload, stamp: Date.now() });
      navigate(ROUTES.contact);
    },
    [navigate]
  );

  const value = useMemo(() => ({ prefill, requestQuote }), [prefill, requestQuote]);

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote doit être utilisé à l’intérieur d’un QuoteProvider.');
  }
  return context;
}
