import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
  getCountriesByRegion,
  getCountriesByDialCode,
  getCountryByDialCode,
  getCountriesByCurrency,
  getCountriesByLanguage,
  filterCountriesByRegions,
  sortCountries,
} from './country.helper';
import { countriesMock } from './country.helper.mock';
import { COUNTRIES_LIST } from '../constants';
import { Continent } from '../models';

describe('CountryHelper', () => {
  it('should be return correct value for getAllowedCountries', () => {
    expect(getAllowedCountries(['CA']).length).toBe(1);
    expect(getAllowedCountries(['ca']).length).toBe(1);
    expect(getAllowedCountries(['TOTO']).length).toBe(0);
  });

  it('should be return correct value for preferredCountries', () => {
    expect(getPreferredCountries(countriesMock(), ['ca']).length).toBe(1);
    expect(getPreferredCountries(countriesMock(), ['CA']).length).toBe(1);
    expect(getPreferredCountries(countriesMock(), ['TOTO']).length).toBe(0);
    expect(getPreferredCountries(countriesMock(), []).length).toBe(0);
  });

  it('should be return correct value for getFilteredCountries', () => {
    expect(getFilteredCountries(countriesMock(), ['ca']).length).toBe(0);
    expect(getFilteredCountries(countriesMock(), ['CA']).length).toBe(0);
    expect(getFilteredCountries(countriesMock(), ['TOTO']).length).toBe(1);
    expect(getFilteredCountries(countriesMock(), []).length).toBe(1);
  });

  it('should be return correct value for getCountriesBasedOnSearch', () => {
    expect(getCountriesBasedOnSearch(countriesMock(), 'ca').length).toBe(1);
    expect(getCountriesBasedOnSearch(countriesMock(), 'CA').length).toBe(1);
    expect(getCountriesBasedOnSearch(countriesMock(), 'TOTO').length).toBe(0);
    expect(getCountriesBasedOnSearch(countriesMock(), '').length).toBe(1);
  });
});

describe('CountryHelper lookups', () => {
  it('getCountriesByRegion returns only countries in that region', () => {
    const euRegion: Continent = 'EU';
    const result = getCountriesByRegion(euRegion);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(c => c.region === 'EU')).toBe(true);
  });

  it('getCountriesByDialCode normalizes + and matches', () => {
    expect(getCountriesByDialCode('+1').length).toBe(
      getCountriesByDialCode('1').length
    );
    expect(getCountriesByDialCode('+91').some(c => c.code === 'IN')).toBe(true);
  });

  it('getCountryByDialCode returns first match or undefined', () => {
    expect(getCountryByDialCode('+91')?.code).toBe('IN');
    expect(getCountryByDialCode('+00000')).toBeUndefined();
  });

  it('getCountriesByCurrency is case-insensitive', () => {
    expect(getCountriesByCurrency('eur').length).toBe(
      getCountriesByCurrency('EUR').length
    );
    expect(getCountriesByCurrency('EUR').length).toBeGreaterThan(0);
  });

  it('getCountriesByLanguage is case-insensitive', () => {
    expect(getCountriesByLanguage('EN').length).toBe(
      getCountriesByLanguage('en').length
    );
    expect(getCountriesByLanguage('en').length).toBeGreaterThan(0);
  });
});

describe('CountryHelper search/sort/region', () => {
  it('getCountriesBasedOnSearch returns all when search is empty', () => {
    expect(getCountriesBasedOnSearch(COUNTRIES_LIST, '').length).toBe(
      COUNTRIES_LIST.length
    );
  });

  it('getCountriesBasedOnSearch respects custom searchFields', () => {
    expect(
      getCountriesBasedOnSearch(COUNTRIES_LIST, 'Ottawa', ['name']).length
    ).toBe(0);
    expect(
      getCountriesBasedOnSearch(COUNTRIES_LIST, 'Ottawa', ['capital']).some(
        c => c.code === 'CA'
      )
    ).toBe(true);
  });

  it('sortCountries sorts by the given key', () => {
    const byName = sortCountries(countriesMock(), 'name');
    expect(byName.map(c => c.name)).toEqual(
      [...countriesMock().map(c => c.name)].sort((a, b) => a.localeCompare(b))
    );
  });

  it('filterCountriesByRegions filters and passes through on empty', () => {
    expect(filterCountriesByRegions(COUNTRIES_LIST, []).length).toBe(
      COUNTRIES_LIST.length
    );
    const eu: Continent = 'EU';
    expect(
      filterCountriesByRegions(COUNTRIES_LIST, [eu]).every(c => c.region === 'EU')
    ).toBe(true);
  });
});

describe('COUNTRIES_LIST data integrity', () => {
  const validRegions: Continent[] = [
    'AF',
    'AS',
    'EU',
    'NA',
    'SA',
    'OC',
    'AN',
  ];

  it('should have at least one country', () => {
    expect(COUNTRIES_LIST.length).toBeGreaterThan(0);
  });

  it('should have a unique alpha-2 code for every country', () => {
    const codes = COUNTRIES_LIST.map(c => c.code.toUpperCase());
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('should have a valid 2-letter uppercase code for every country', () => {
    const invalid = COUNTRIES_LIST.filter(c => !/^[A-Z]{2}$/.test(c.code));
    expect(invalid.map(c => c.name)).toEqual([]);
  });

  it('should have a valid region for every country', () => {
    const invalid = COUNTRIES_LIST.filter(
      c => !validRegions.includes(c.region)
    );
    expect(invalid.map(c => c.name)).toEqual([]);
  });

  it('should have a 3-digit numeric isoCode for every country', () => {
    const invalid = COUNTRIES_LIST.filter(c => !/^\d{3}$/.test(c.isoCode));
    expect(invalid.map(c => c.name)).toEqual([]);
  });

  it('should have a dialling code starting with + for every country', () => {
    const invalid = COUNTRIES_LIST.filter(
      c => !/^\+/.test(c.dialling_code)
    );
    expect(invalid.map(c => c.name)).toEqual([]);
  });

  it('should have non-empty required fields for every country', () => {
    const invalid = COUNTRIES_LIST.filter(
      c => !c.name?.trim() || !c.code?.trim() || !c.capital?.trim()
    );
    expect(invalid.map(c => c.code)).toEqual([]);
  });
});
