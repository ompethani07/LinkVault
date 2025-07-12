// Currency conversion utilities
export interface CurrencyRate {
  currency: string;
  rate: number;
  symbol: string;
}

export const currencyRates: Record<string, CurrencyRate> = {
  'US': { currency: 'USD', rate: 1, symbol: '$' },
  'GB': { currency: 'GBP', rate: 0.79, symbol: '£' },
  'EU': { currency: 'EUR', rate: 0.85, symbol: '€' },
  'CA': { currency: 'CAD', rate: 1.25, symbol: 'C$' },
  'AU': { currency: 'AUD', rate: 1.35, symbol: 'A$' },
  'JP': { currency: 'JPY', rate: 110, symbol: '¥' },
  'IN': { currency: 'INR', rate: 75, symbol: '₹' },
  'BR': { currency: 'BRL', rate: 5.2, symbol: 'R$' },
  'MX': { currency: 'MXN', rate: 20, symbol: 'MX$' },
  'KR': { currency: 'KRW', rate: 1180, symbol: '₩' },
  'CN': { currency: 'CNY', rate: 6.4, symbol: '¥' },
  'RU': { currency: 'RUB', rate: 73, symbol: '₽' },
  'ZA': { currency: 'ZAR', rate: 14.5, symbol: 'R' },
  'NG': { currency: 'NGN', rate: 410, symbol: '₦' },
  'EG': { currency: 'EGP', rate: 15.7, symbol: 'E£' },
  'AE': { currency: 'AED', rate: 3.67, symbol: 'د.إ' },
  'SA': { currency: 'SAR', rate: 3.75, symbol: 'ر.س' },
  'PK': { currency: 'PKR', rate: 160, symbol: '₨' },
  'BD': { currency: 'BDT', rate: 85, symbol: '৳' },
  'PH': { currency: 'PHP', rate: 50, symbol: '₱' },
  'TH': { currency: 'THB', rate: 33, symbol: '฿' },
  'VN': { currency: 'VND', rate: 23000, symbol: '₫' },
  'ID': { currency: 'IDR', rate: 14200, symbol: 'Rp' },
  'MY': { currency: 'MYR', rate: 4.2, symbol: 'RM' },
  'SG': { currency: 'SGD', rate: 1.35, symbol: 'S$' },
  'NZ': { currency: 'NZD', rate: 1.4, symbol: 'NZ$' },
  'TR': { currency: 'TRY', rate: 8.5, symbol: '₺' },
  'PL': { currency: 'PLN', rate: 3.9, symbol: 'zł' },
  'SE': { currency: 'SEK', rate: 8.5, symbol: 'kr' },
  'NO': { currency: 'NOK', rate: 8.6, symbol: 'kr' },
  'DK': { currency: 'DKK', rate: 6.3, symbol: 'kr' },
  'CH': { currency: 'CHF', rate: 0.92, symbol: 'Fr' },
  'IL': { currency: 'ILS', rate: 3.25, symbol: '₪' },
  'AR': { currency: 'ARS', rate: 98, symbol: '$' },
  'CL': { currency: 'CLP', rate: 800, symbol: '$' },
  'CO': { currency: 'COP', rate: 3800, symbol: '$' },
  'PE': { currency: 'PEN', rate: 3.6, symbol: 'S/.' },
  'UY': { currency: 'UYU', rate: 44, symbol: '$U' },
  'DEFAULT': { currency: 'USD', rate: 1, symbol: '$' }
};

export function formatPrice(usdPrice: number, currencyInfo: CurrencyRate): string {
  const convertedPrice = usdPrice * currencyInfo.rate;
  
  // Format based on currency
  if (currencyInfo.currency === 'JPY' || currencyInfo.currency === 'KRW' || currencyInfo.currency === 'VND') {
    return `${currencyInfo.symbol}${Math.round(convertedPrice).toLocaleString()}`;
  } else if (currencyInfo.currency === 'INR' || currencyInfo.currency === 'PKR' || currencyInfo.currency === 'BDT') {
    return `${currencyInfo.symbol}${Math.round(convertedPrice)}`;
  } else {
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  }
}

export async function getUserCountry(): Promise<string> {
  try {
    // Try to get country from IP geolocation
    const response = await fetch('https://ipapi.co/json/', {
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.country_code || 'US';
    }
  } catch (error) {
    console.log('Could not detect country, falling back to US');
  }
  
  // Fallback to browser locale
  try {
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1];
    return countryCode || 'US';
  } catch (error) {
    console.log('Could not detect country from locale, using US');
  }
  
  return 'US';
}

export function getCurrencyByCountry(countryCode: string): CurrencyRate {
  // Map some common country codes to currency regions
  const countryToCurrency: Record<string, string> = {
    'US': 'US', 'CA': 'CA', 'GB': 'GB', 'AU': 'AU', 'NZ': 'NZ',
    'DE': 'EU', 'FR': 'EU', 'IT': 'EU', 'ES': 'EU', 'NL': 'EU', 'BE': 'EU',
    'AT': 'EU', 'PT': 'EU', 'GR': 'EU', 'FI': 'EU', 'IE': 'EU', 'LU': 'EU',
    'JP': 'JP', 'IN': 'IN', 'BR': 'BR', 'MX': 'MX', 'KR': 'KR', 'CN': 'CN',
    'RU': 'RU', 'ZA': 'ZA', 'NG': 'NG', 'EG': 'EG', 'AE': 'AE', 'SA': 'SA',
    'PK': 'PK', 'BD': 'BD', 'PH': 'PH', 'TH': 'TH', 'VN': 'VN', 'ID': 'ID',
    'MY': 'MY', 'SG': 'SG', 'TR': 'TR', 'PL': 'PL', 'SE': 'SE', 'NO': 'NO',
    'DK': 'DK', 'CH': 'CH', 'IL': 'IL', 'AR': 'AR', 'CL': 'CL', 'CO': 'CO',
    'PE': 'PE', 'UY': 'UY'
  };
  
  const currencyKey = countryToCurrency[countryCode] || 'DEFAULT';
  return currencyRates[currencyKey];
}
