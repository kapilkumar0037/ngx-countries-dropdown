import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
} from './country.helper';
import { countriesMock } from './country.helper.mock';

describe('CountryHelper', () => {
  it('should be return correct value for getAllowedCountries', () => {
    expect(getAllowedCountries(['CA']).length).toBe(0);
    expect(getAllowedCountries(['ca']).length).toBe(1);
    expect(getAllowedCountries(['TOTO']).length).toBe(0);
  });

  it('should be return correct value for preferredCountries', () => {
    expect(getPreferredCountries(countriesMock(), ['ca']).length).toBe(1);
    expect(getPreferredCountries(countriesMock(), ['CA']).length).toBe(0);
    expect(getPreferredCountries(countriesMock(), ['TOTO']).length).toBe(0);
    expect(getPreferredCountries(countriesMock(), []).length)
      .withContext('return all preffered countries')
      .toBe(1);
  });

  it('should be return correct value for getFilteredCountries', () => {
    expect(getFilteredCountries(countriesMock(), ['ca']).length).toBe(0);
    expect(getFilteredCountries(countriesMock(), ['CA']).length).toBe(1);
    expect(getFilteredCountries(countriesMock(), ['TOTO']).length).toBe(1);
    expect(getFilteredCountries(countriesMock(), []).length)
      .withContext('return all filtered countries')
      .toBe(1);
  });

  it('should be return correct value for getFilteredCountries', () => {
    expect(getCountriesBasedOnSearch(countriesMock(), 'ca').length).toBe(1);
    expect(getCountriesBasedOnSearch(countriesMock(), 'CA').length).toBe(1);
    expect(getCountriesBasedOnSearch(countriesMock(), 'TOTO').length).toBe(0);
    expect(getCountriesBasedOnSearch(countriesMock(), '').length)
      .withContext('return all countries')
      .toBe(1);
  });
});
