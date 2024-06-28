import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IConfig, ICountry } from '../../models';
import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
} from '../../helpers/country.helper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  imports: [FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick()',
  },
})
export class CountryListComponent implements OnInit {
  search = viewChild<ElementRef>('search');
  readonly searchText = model('');

  readonly standardCountries = computed(() =>
    getFilteredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    )
  );

  readonly filteredCountries = computed(() =>
    getCountriesBasedOnSearch(this.standardCountries(), this.searchText())
  );

  readonly selectedCountry = signal<ICountry | null>(null);

  readonly displayList = signal(false);
  readonly displaySearch = signal(false);

  readonly selectedCountryCode = input('');

  readonly preferredCountryCodes = input<string[]>([]);

  readonly allowedCountryCodes = input<string[]>([]);

  readonly blockedCountryCodes = input<string[]>([]);

  readonly selectedCountryConfig = input<IConfig>({});

  readonly countryListConfig = input<IConfig>({});

  readonly countryList = computed(() =>
    getAllowedCountries(this.allowedCountryCodes())
  );

  readonly countriesExpectBlocked = computed(() =>
    getFilteredCountries(this.countryList(), this.blockedCountryCodes())
  );

  readonly preferredCountryList = computed(() => {
    const result = getPreferredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    );

    return getCountriesBasedOnSearch(result, this.searchText());
  });

  readonly onCountryChange = output<ICountry>();

  ngOnInit(): void {
    const selectedCountryCode = this.selectedCountryCode();
    if (selectedCountryCode) {
      const country = this.countriesExpectBlocked().find(
        x => x.code === selectedCountryCode.toUpperCase()
      );

      if (country) {
        this.selectedCountry.set(country);
        this.onCountryChange.emit(country);
      }
    }
  }

  changeCountry(country: ICountry): void {
    this.selectedCountry.set(country);
    this.displayList.set(false);
    this.onCountryChange.emit(country);
    this.displaySearch.set(false);
    this.searchText.set('');
  }

  toggleList(): void {
    this.displayList.update(isDisplayed => !isDisplayed);
    if(this.displayList()=== true){
      this.displaySearch.set(true);
      setTimeout(() => {
       this.search()?.nativeElement.focus();        
      }, 10);
    }
  }

  onDocumentClick(): void {
    this.displayList.set(false);
    this.displaySearch.set(false);
    this.searchText.set('');
  }
}
