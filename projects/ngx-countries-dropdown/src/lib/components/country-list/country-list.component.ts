import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { form, FormValueControl, FormField } from '@angular/forms/signals';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge } from 'rxjs';

@Component({
  selector: 'lib-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    '(document:click)': 'onDocumentClick()',
  },
})
export class CountryListComponent implements FormValueControl<string | null> {
  readonly search = viewChild<ElementRef>('search');
  readonly dropdownList = viewChild<ElementRef>('dropdownList');

  readonly searchText = signal('');

  readonly searchTextForm = form(this.searchText);

  readonly standardCountries = computed(() =>
    getFilteredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    )
  );

  readonly filteredCountries = computed(() =>
    getCountriesBasedOnSearch(this.standardCountries(), this.searchText())
  );

  readonly value = model<string | null>(null);

  readonly displayList = signal(false);

  readonly displaySearch = signal(false);

  readonly focusedIndex = signal(0);

  readonly selectedCountryCode = input<string | null>(null);

  readonly placeholderText = input('Select country');

  readonly preferredCountryCodes = input<string[]>([]);

  readonly allowedCountryCodes = input<string[]>([]);

  readonly blockedCountryCodes = input<string[]>([]);

  readonly selectedCountryConfig = input<IConfig>({});

  readonly countryListConfig = input<IConfig>({});

  private readonly countryList = computed(() =>
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

  readonly onCountryChange = output<string>();

  private readonly selectedCountry$ = merge(
    toObservable(this.value),
    toObservable(this.selectedCountryCode).pipe(filter(Boolean))
  ).pipe(
    map(selectedValue => {
      const country = selectedValue
        ? this.countriesExpectBlocked().find(
            x => x.code === selectedValue.toUpperCase()
          )
        : null;
      return country ?? null;
    })
  );

  readonly selectedCountry = toSignal(this.selectedCountry$, {
    initialValue: null,
  });

  changeCountry(country: ICountry): void {
    this.value.set(country.code);
    this.onCountryChange.emit(country.code);

    this.displayList.set(false);
    this.displaySearch.set(false);
    this.searchText.set('');
    this.scrollToFocusedItem();
  }

  toggleList(): void {
    this.displayList.update(isDisplayed => !isDisplayed);
    if (this.displayList() === true) {
      this.displaySearch.set(true);
      this.setFocusedIndex();
      this.scrollToFocusedItem();
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

  onKeydown(event: KeyboardEvent) {
    const filteredCountriesLength =
      this.preferredCountryList().length + this.filteredCountries().length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex.set(
        (this.focusedIndex() + 1) % filteredCountriesLength
      );
      this.scrollToFocusedItem();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex.set(
        (this.focusedIndex() - 1 + filteredCountriesLength) %
          filteredCountriesLength
      );
      this.scrollToFocusedItem();
    } else if (event.key === 'Enter' && this.focusedIndex() !== -1) {
      event.preventDefault();
      this.changeCountry(
        [...this.preferredCountryList(), ...this.filteredCountries()][
          this.focusedIndex()
        ]
      );
    }
  }

  scrollToFocusedItem() {
    if (this.focusedIndex() >= 0 && this.dropdownList()) {
      const dropdownElement = this.dropdownList()?.nativeElement;
      const focusedItemElement = dropdownElement.children[this.focusedIndex()];
      const listItemOffsetTop = focusedItemElement.offsetTop;
      const listItemOffsetHeight = focusedItemElement.offsetHeight;
      const dropdownScrollTop = dropdownElement.scrollTop;
      const dropdownOffsetHeight = dropdownElement.offsetHeight;

      if (listItemOffsetTop < dropdownScrollTop) {
        dropdownElement.scrollTop = listItemOffsetTop;
      } else if (
        listItemOffsetTop + listItemOffsetHeight >
        dropdownScrollTop + dropdownOffsetHeight
      ) {
        dropdownElement.scrollTop =
          listItemOffsetTop +
          listItemOffsetHeight -
          (dropdownOffsetHeight - 40);
      }
    }
  }

  onSearchTextChange() {
    this.focusedIndex.set(0);
  }

  setFocusedIndex() {
    if (this.value()) {
      const selectedIndex = [
        ...this.preferredCountryList(),
        ...this.filteredCountries(),
      ].findIndex(country => country.code === this.value());
      this.focusedIndex.set(selectedIndex);
    }
  }
}
