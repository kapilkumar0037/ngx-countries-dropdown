import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IConfig } from 'projects/ngx-countries-dropdown/src/lib/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly title = 'sandbox';
  readonly preferredCountryCodes: string[] = [];
  readonly blockedCountryCodes: string[] = [];
  readonly selectedCountryCode = 'in';
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
