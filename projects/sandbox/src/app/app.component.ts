import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import {
  CountryListComponent,
  IConfig,
  getCountryByCode,
} from '@ngx-countries-dropdown';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <div>Country list with search</div>
      <lib-country-list
        [preferredCountryCodes]="preferredCountryCodes"
        [blockedCountryCodes]="blockedCountryCodes"
        [allowedCountryCodes]="allowedCountryCodes"
        [selectedCountryConfig]="selectedCountryConfig"
        [countryListConfig]="countryListConfig"
        selectedCountryCode="in"
        placeholderText="Select country"
        (onCountryChange)="onCountryChange($event)" />
    </div>

    <div>
      <div>Country list with signal form</div>
      <lib-country-list
        [preferredCountryCodes]="preferredCountryCodes"
        [blockedCountryCodes]="blockedCountryCodes"
        [allowedCountryCodes]="allowedCountryCodes"
        [selectedCountryConfig]="selectedCountryConfig"
        [countryListConfig]="countryListConfig"
        placeholderText="Select country"
        [formField]="countryForm" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountryListComponent, FormField, ReactiveFormsModule],
})
export class AppComponent {
  readonly title = 'sandbox';

  readonly countryCode = signal('in');

  readonly countryForm = form(this.countryCode);

  readonly preferredCountryCodes: string[] = [];
  readonly blockedCountryCodes: string[] = [];
  readonly allowedCountryCodes: string[] = [];

  readonly selectedCountryConfig: IConfig = {
    displayCurrencyCode: false,
    displayCurrencyName: false,
    displayCurrencySymbol: false,
    displayLanguageCode: false,
    displayLanguageName: false,
  };

  readonly countryListConfig: IConfig = {
    displayCurrencyCode: false,
    displayCurrencyName: false,
    displayCurrencySymbol: false,
    displayLanguageCode: false,
    displayLanguageName: false,
  };

  onCountryChange(countryCode: string) {
    const country = getCountryByCode(countryCode);
    console.log(country);
  }
}
