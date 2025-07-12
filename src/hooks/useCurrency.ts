import { useState, useEffect } from 'react';
import { CurrencyRate, getUserCountry, getCurrencyByCountry, currencyRates } from '@/lib/currency';

export function useCurrency() {
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyRate>(currencyRates.DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState<string>('US');

  useEffect(() => {
    async function detectCurrency() {
      try {
        const detectedCountry = await getUserCountry();
        setCountry(detectedCountry);
        
        const currency = getCurrencyByCountry(detectedCountry);
        setCurrencyInfo(currency);
      } catch (error) {
        console.error('Error detecting currency:', error);
        setCurrencyInfo(currencyRates.DEFAULT);
      } finally {
        setIsLoading(false);
      }
    }

    detectCurrency();
  }, []);

  return { currencyInfo, isLoading, country };
}
