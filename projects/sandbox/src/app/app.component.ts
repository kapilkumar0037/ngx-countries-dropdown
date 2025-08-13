import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CountryListComponent, IConfig } from 'ngx-countries-dropdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CountryListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly title = 'sandbox';
  readonly preferredCountryCodes: string[] = [];
  readonly blockedCountryCodes: string[] = [];
  readonly selectedCountryCode = 'in';
  readonly placeholderText = "Select country";
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
  readonly allowedCountryCodes: string[] = [];

  onCountryChange(country: any) {
    console.log(country);
  }
}
