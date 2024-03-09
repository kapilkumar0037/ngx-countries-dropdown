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
  name?: string;
  code?: string;
  capital?: string;
  region?: string;
  currency?: ICurrency;
  language?: ILanguage;
  dialling_code?: string;
  isoCode?: string;
  demonym?: string;
}

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
