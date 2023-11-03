import { Injectable } from '@angular/core';
import { ICountry } from '../models';
import { countryList } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private allCountries: ICountry[] = countryList;
  private preferredCountries: ICountry[] = [];
  private standardCountries: ICountry[] = [];
  constructor() {}

  getAllCountries() {
    return this.allCountries;
  }
  getPreferredCountries() {
    return this.preferredCountries;
  }
  getStandardCountries() {
    return this.standardCountries;
  }

  getAllAllowedCountries(allowedCountryCodes: string[]): ICountry[] {
    let result: ICountry[] = this.allCountries;
    if (allowedCountryCodes?.length > 0) {
      result = this.allCountries.filter((x) =>
      allowedCountryCodes.includes(x.code?.toLowerCase()!)
      );
    }
    return result;
  }

  setPreferredCountries(
    countriesToFilter: ICountry[],
    preferredCountryCodes: string[]
  ): ICountry[] {
    let result: ICountry[] = [];
    if (preferredCountryCodes?.length > 0) {
      result = countriesToFilter.filter((x) =>
        preferredCountryCodes.includes(x.code?.toLowerCase()!)
      );
    }
    this.preferredCountries = result;
    this.standardCountries = this.getFilteredCountries(countriesToFilter, preferredCountryCodes);
    return result;
  }

  getFilteredCountries(countriesToFilter: ICountry[], countryCodes: string[]) {
    let result = countriesToFilter;
    if (countryCodes?.length > 0) {
      result = countriesToFilter.filter(
        (x) => !countryCodes.includes(x.code?.toLowerCase()!)
      );
    }
    return result;
  }

  getCountriesBasedOnSearch(countriesToSearch: ICountry[], searchText: string) {
    return countriesToSearch.filter(
      (x) =>
        x.name?.toLowerCase()?.includes(searchText?.toLowerCase()) || x.dialling_code?.toLowerCase()?.includes(searchText?.toLowerCase())
    );
  }
}
