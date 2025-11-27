/**
 * Currency conversion utilities
 * Uses free API from exchangerate-api.com (no API key required for basic usage)
 * Alternative: fixer.io, currencyapi.net, or openexchangerates.org
 */

export interface CurrencyRate {
  code: string;
  rate: number;
  timestamp: number;
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  converted: number;
  rate: number;
}

// Common currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
  BRL: 'R$',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  RUB: '₽',
  TRY: '₺',
  ZAR: 'R',
  MXN: '$',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  GEL: '₾', // Georgian Lari
  // Add more as needed
};

// Cache for exchange rates (refresh every hour)
let exchangeRateCache: {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get exchange rates from API
 * Using exchangerate-api.com (free, no API key needed)
 */
async function fetchExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
  // Check cache first
  if (exchangeRateCache && 
      exchangeRateCache.base === baseCurrency &&
      Date.now() - exchangeRateCache.timestamp < CACHE_DURATION) {
    return exchangeRateCache.rates;
  }

  try {
    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the rates
    exchangeRateCache = {
      rates: data.rates,
      base: baseCurrency,
      timestamp: Date.now(),
    };

    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Return cached rates if available, even if expired
    if (exchangeRateCache && exchangeRateCache.base === baseCurrency) {
      console.warn('Using expired exchange rate cache due to API error');
      return exchangeRateCache.rates;
    }
    
    // Fallback: return empty rates (conversion will fail gracefully)
    return {};
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (amount === 0) {
    return 0;
  }

  // Normalize currency codes
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  // Get exchange rates (base: USD)
  const rates = await fetchExchangeRates('USD');

  if (!rates[from] || !rates[to]) {
    console.warn(`Exchange rate not found for ${from} or ${to}`);
    // Return original amount if conversion fails
    return amount;
  }

  // Convert: fromCurrency -> USD -> toCurrency
  const amountInUSD = from === 'USD' ? amount : amount / rates[from];
  const convertedAmount = to === 'USD' ? amountInUSD : amountInUSD * rates[to];

  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
}

/**
 * Get exchange rate between two currencies
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rates = await fetchExchangeRates('USD');
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (!rates[from] || !rates[to]) {
    return 1; // Default to 1:1 if rate not found
  }

  // Calculate rate: fromCurrency -> USD -> toCurrency
  const rate = (1 / rates[from]) * rates[to];
  return rate;
}

/**
 * Format number with comma separators for thousands
 */
export function formatNumberWithCommas(num: number): string {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format large numbers with K/KK notation
 * K = thousands (e.g., 1.5K = 1,500)
 * KK = millions (e.g., 2.3KK = 2,300,000)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    // KK = millions abbreviation
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}KK` : `${millions.toFixed(1)}KK`;
  } else if (num >= 1000) {
    // K = thousands abbreviation
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return formatNumberWithCommas(num);
}

/**
 * Format currency amount with symbol and comma separators
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
  const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount || 0)) || 0;
  return `${symbol}${formatNumberWithCommas(numAmount)}`;
}

/**
 * Format currency amount with symbol, using K/KK notation for large amounts
 * K = thousands, KK = millions
 */
export function formatCurrencyCompact(amount: number | null | undefined, currency: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
  const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount || 0)) || 0;
  
  if (numAmount >= 1000) {
    return `${symbol}${formatLargeNumber(numAmount)}`;
  }
  return formatCurrency(amount, currency);
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
}

/**
 * Validate currency code
 */
export function isValidCurrency(currency: string): boolean {
  return /^[A-Z]{3}$/.test(currency.toUpperCase());
}

/**
 * Common currencies list for dropdowns
 */
export const COMMON_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
];

