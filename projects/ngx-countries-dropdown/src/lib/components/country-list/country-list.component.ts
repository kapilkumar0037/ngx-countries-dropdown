import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IConfig, ICountry } from '../../helpers/models';
import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
} from '../../helpers/country.fn';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_CONFIG } from '../../helpers/config.const';
import { CONTRIES_BY_CODES } from '../../helpers/countries.const';

@Component({
  selector: 'lib-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Continuous support for < V20
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useFactory: forwardRef(() => CountryListComponent),
    multi: true,
  }],
  host: {
    '(document:click)': 'onDocumentClick()',
  }
})
export class CountryListComponent implements ControlValueAccessor, OnInit {

  private readonly search = viewChild<string, ElementRef>('search', { read: ElementRef });

  readonly selectedCountry = computed<ICountry | null>(() => {
    const countryCode = this.value();
    if (!countryCode) return null;
    return CONTRIES_BY_CODES[countryCode] ?? null;
  });

  readonly searchText = model('');

  readonly isDisabled = signal(false);

  onChange = (_: string | null) => { };

  onTouch = (_: unknown) => { };

  readonly standardCountries = computed(() =>
    getFilteredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    )
  );

  readonly filteredCountries = computed(() =>
    getCountriesBasedOnSearch(this.standardCountries(), this.searchText())
  );

  readonly value = signal<string | null>(null);

  readonly displayList = signal(false);

  readonly displaySearch = signal(false);

  readonly selectedCountryCode = input('');

  readonly placeholderText = input('Select country');

  readonly preferredCountryCodes = input<string[]>([]);

  readonly allowedCountryCodes = input<string[]>([]);

  readonly blockedCountryCodes = input<string[]>([]);

  readonly selectedCountryConfig = input(DEFAULT_CONFIG);

  protected readonly countryListConfig = computed<NonNullable<IConfig>>(() => {
    return {
      ...DEFAULT_CONFIG,
      ...this.selectedCountryConfig(),
    }
  });

  readonly countryList = computed(() =>
    getAllowedCountries(this.allowedCountryCodes())
  );

  ngOnInit(): void {
    this.value.set(this.autoSelectCountry(this.selectedCountryCode()));
  }

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

  readonly onCountryChange = output<ICountry | null>();

  autoSelectCountry(selectedCountryCode: string | null) {
    if (!selectedCountryCode) return null;

    const country = this.countriesExpectBlocked().find(
      x => x.code === selectedCountryCode.toUpperCase()
    );

    return country ? country.code : null;
  }

  writeValue(countryCode: string | null): void {
    const selectedCountryCode = this.autoSelectCountry(countryCode)
    this.value.set(selectedCountryCode);
  }

  registerOnChange(fn: () => unknown): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => unknown): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  changeCountry(countryCode: string): void {
    this.value.set(countryCode);
    this.displayList.set(false);
    this.displaySearch.set(false);
    this.searchText.set('');
    this.onChange(countryCode);
    this.onCountryChange.emit(this.selectedCountry());

  }

  toggleList(): void {
    this.displayList.update(isDisplayed => !isDisplayed);
    if (this.displayList() === true) {
      this.displaySearch.set(true);
      setTimeout(() => this.search()?.nativeElement.focus(), 10);
    }
  }

  onDocumentClick(): void {
    this.displayList.set(false);
    this.displaySearch.set(false);
    this.searchText.set('');
  }
}
