import { ICountry } from '../models';

export const countriesMock = (): ICountry[] => {
  return [
    {
      name: 'Canada',
      code: 'CA',
      capital: 'Ottawa',
      region: 'NA',
      currency: {
        code: 'CAD',
        name: 'Canadian dollar',
        symbol: '$',
      },
      language: {
        code: 'en',
        name: 'English',
      },
      dialling_code: '+1',
      isoCode: '124',
    },
  ];
};
