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
  readonly preferredCountryCodes: string[] = ['us', 'in'];
  readonly blockedCountryCodes: string[] = [];
  readonly selectedCountryConfig: IConfig = {
    displayCurrencyCode: true,
    displayCurrencyName: true,
    displayCurrencySymbol: true,
    displayLanguageCode: true,
    displayLanguageName: true,
  };
  readonly countryListConfig: IConfig = {
    displayCurrencyCode: true,
    displayCurrencyName: true,
    displayCurrencySymbol: true,
    displayLanguageCode: true,
    displayLanguageName: true,
  };
  readonly allowedCountryCodes: string[] = [];

  onCountryChange(country: any) {
    console.log(country);
  }
}
