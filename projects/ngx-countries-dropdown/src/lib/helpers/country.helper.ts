import { ICountry } from '../models';
import { COUNTRIES_LIST } from '../constants';
import { Continent, SearchField, SortBy } from '../models';

export const getAllowedCountries = (
  allowedCountryCodes: string[]
): ICountry[] => {
  if (allowedCountryCodes.length > 0) {
    const allowed = allowedCountryCodes.map(code => code.toLowerCase());
    return COUNTRIES_LIST.filter(x => allowed.includes(x.code.toLowerCase()));
  }

  return COUNTRIES_LIST;
};

export const getPreferredCountries = (
  countriesToFilter: ICountry[],
  preferredCountryCodes: string[]
): ICountry[] => {
  if (preferredCountryCodes.length > 0) {
    const preferred = preferredCountryCodes.map(code => code.toLowerCase());
    return countriesToFilter.filter(x =>
      preferred.includes(x.code.toLowerCase())
    );
  }

  return [];
};

export const getFilteredCountries = (
  countriesToFilter: ICountry[],
  countryCodes: string[]
) => {
  if (countryCodes.length > 0) {
    const excluded = countryCodes.map(code => code.toLowerCase());
    return countriesToFilter.filter(
      x => !excluded.includes(x.code.toLowerCase())
    );
  }
  return countriesToFilter;
};

export const getCountriesBasedOnSearch = (
  countriesToSearch: ICountry[],
  searchText: string,
  searchFields: SearchField[] = ['name', 'code', 'dialCode']
) => {
  const search = searchText?.toLowerCase() ?? '';
  if (!search) {
    return countriesToSearch;
  }
  return countriesToSearch.filter(country =>
    searchFields.some(field => matchesField(country, field, search))
  );
};

const matchesField = (
  country: ICountry,
  field: SearchField,
  search: string
): boolean => {
  const values: Record<SearchField, (string | undefined)[]> = {
    name: [country.name],
    code: [country.code],
    dialCode: [country.dialling_code],
    capital: [country.capital],
    currency: [country.currency.code ?? undefined, country.currency.name],
    language: [country.language.code, country.language.name],
    isoCode: [country.isoCode],
  };
  return values[field].some(value =>
    value?.toLowerCase()?.includes(search)
  );
};

export const sortCountries = (
  countries: ICountry[],
  sortBy: SortBy
): ICountry[] => {
  const key: Record<SortBy, (c: ICountry) => string> = {
    name: c => c.name,
    code: c => c.code,
    dialCode: c => c.dialling_code,
  };
  const getKey = key[sortBy];
  return [...countries].sort((a, b) =>
    getKey(a).localeCompare(getKey(b))
  );
};

export const getCountryByCodes = (codes: string[]) => {
  const normalized = codes.map(code => code.toUpperCase());
  return COUNTRIES_LIST.filter(x => normalized.includes(x.code.toUpperCase()));
};

export const getCountryByCode = (code: string): ICountry | undefined => {
  return COUNTRIES_LIST.find(x => code.toUpperCase() === x.code.toUpperCase());
};

export const getCountriesByRegion = (region: Continent): ICountry[] => {
  return COUNTRIES_LIST.filter(x => x.region === region);
};

export const filterCountriesByRegions = (
  countries: ICountry[],
  regions: Continent[]
): ICountry[] => {
  if (regions.length === 0) {
    return countries;
  }
  return countries.filter(x => regions.includes(x.region));
};

export const getCountriesByDialCode = (dialCode: string): ICountry[] => {
  const normalized = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  return COUNTRIES_LIST.filter(x => x.dialling_code === normalized);
};

export const getCountryByDialCode = (
  dialCode: string
): ICountry | undefined => {
  return getCountriesByDialCode(dialCode)[0];
};

export const getCountriesByCurrency = (currencyCode: string): ICountry[] => {
  const code = currencyCode.toUpperCase();
  return COUNTRIES_LIST.filter(
    x => x.currency.code?.toUpperCase() === code
  );
};

export const getCountriesByLanguage = (languageCode: string): ICountry[] => {
  const code = languageCode.toLowerCase();
  return COUNTRIES_LIST.filter(
    x => x.language.code?.toLowerCase() === code
  );
};
