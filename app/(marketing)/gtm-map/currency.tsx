'use client';

import { createContext, useContext } from 'react';
import { USD_PER_GBP } from './gtm-data';

export type Currency = 'GBP' | 'USD';

// React Flow renders custom nodes itself, so there is no prop path from the
// page down to each node. Context is how the toggle reaches them.
const CurrencyContext = createContext<Currency>('GBP');

export const CurrencyProvider = CurrencyContext.Provider;

export function useCurrency() {
  return useContext(CurrencyContext);
}

/** Formats a sterling millions value in the active currency. */
export function useMoneyM() {
  const currency = useCurrency();
  return (valueM: number) => {
    if (currency === 'USD') return `$${(valueM * USD_PER_GBP).toFixed(1)}m`;
    return `£${valueM.toFixed(1)}m`;
  };
}
