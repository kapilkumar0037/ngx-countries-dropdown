import { ICountry } from '../models';
import { COUNTRIES_LIST } from '../constants';

export const getAllowedCountries = (
  allowedCountryCodes: string[]
): ICountry[] => {
  if (allowedCountryCodes.length > 0) {
    return COUNTRIES_LIST.filter(x =>
      allowedCountryCodes.includes(x.code?.toLowerCase()!)
    );
  }

  return COUNTRIES_LIST;
};

export const getPreferredCountries = (
  countriesToFilter: ICountry[],
  preferredCountryCodes: string[]
): ICountry[] => {
  if (preferredCountryCodes.length > 0) {
    return countriesToFilter.filter(x =>
      preferredCountryCodes.includes(x.code?.toLowerCase()!)
    );
  }

  return [];
};

export const getFilteredCountries = (
  countriesToFilter: ICountry[],
  countryCodes: string[]
) => {
  if (countryCodes.length > 0) {
    return countriesToFilter.filter(
      x => !countryCodes.includes(x.code?.toLowerCase()!)
    );
  }
  return countriesToFilter;
};

export const getCountriesBasedOnSearch = (
  countriesToSearch: ICountry[],
  searchText: string
) => {
  return countriesToSearch.filter(
    x =>
      x.name?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
      x.dialling_code?.toLowerCase()?.includes(searchText?.toLowerCase())
  );
};
