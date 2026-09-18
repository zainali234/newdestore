export type Currency = 'EUR';

export interface BankAccountDetails {
  region: 'DE' | 'EUR';
  currency: Currency;
  currencyLabel: string;
  badge: string;
  accountType: string;
  accountHolder: string;
  iban: string;
  bicSwift: string;
  accountNumber: string;
  sortCode: string;
  bankName: string;
  bankAddress: string;
  transferNotice: string;
}

export const EUR_BANK_DETAILS: BankAccountDetails = {
  region: 'DE',
  currency: 'EUR',
  currencyLabel: 'Euro (€) - Germany & Europe',
  badge: 'Official EUR Account',
  accountType: 'EUR Account',
  accountHolder: 'Faran ahmed',
  iban: 'GB06CLRB04281222476203',
  bicSwift: 'CLRBGB22XXX',
  accountNumber: '22476203',
  sortCode: '042812',
  bankName: 'Clear Bank',
  bankAddress: '133 Houndsditch, LONDON, EC3A 7BX',
  transferNotice: 'Only for EUR Transfers',
};

// Defensive export supporting direct access or region key access
export const BANK_DETAILS: BankAccountDetails & {
  DE: BankAccountDetails;
  EUR: BankAccountDetails;
  UK: BankAccountDetails;
  US: BankAccountDetails;
} = Object.assign(
  { ...EUR_BANK_DETAILS },
  {
    DE: EUR_BANK_DETAILS,
    EUR: EUR_BANK_DETAILS,
    UK: EUR_BANK_DETAILS,
    US: EUR_BANK_DETAILS,
  }
);

export function convertPrice(price: number, _currency?: string): number {
  // All store pricing normalized directly to Euro (€)
  return Number(price.toFixed(2));
}

export function formatPrice(price: number, _currency?: string): string {
  const converted = convertPrice(price, _currency);
  return `€${converted.toFixed(2)}`;
}

export function getCurrencySymbol(_currency?: string): string {
  return '€';
}
