export interface IConfig {
  hideFlag?: boolean;
  hideCode?: boolean;
  hideName?: boolean;
  hideSearch?: boolean;
  hideDialCode?: boolean;
  displayCapital?: boolean;
  displayLanguageCode?: boolean;
  displayLanguageName?: boolean;
  displayCurrencyCode?: boolean;
  displayCurrencyName?: boolean;
  displayCurrencySymbol?: boolean;
}

export interface ICountry {
  name: string;
  code: string;
  capital: string;
  region: Continent;
  currency: ICurrency;
  language: ILanguage;
  dialling_code: string;
  isoCode: string;
  demonym?: string;
}

export type Continent = 'AF' | 'AS' | 'EU' | 'NA' | 'SA' | 'OC' | 'AN';

export type SearchField =
  | 'name'
  | 'code'
  | 'dialCode'
  | 'capital'
  | 'currency'
  | 'language'
  | 'isoCode';

export type SortBy = 'name' | 'code' | 'dialCode';

export interface ICurrency {
  code?: string | null;
  name?: string;
  symbol?: string | null;
}

export interface ILanguage {
  code?: string;
  name?: string;
  iso639_2?: string;
  nativeName?: string;
}
