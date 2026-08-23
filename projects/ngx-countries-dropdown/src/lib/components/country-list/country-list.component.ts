import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IConfig, ICountry } from '../../models';
import { Continent, SearchField, SortBy } from '../../models';
import {
  getAllowedCountries,
  getCountriesBasedOnSearch,
  getFilteredCountries,
  getPreferredCountries,
  filterCountriesByRegions,
  sortCountries,
} from '../../helpers/country.helper';
import { form, FormField, FormValueControl } from '@angular/forms/signals';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  imports: [FormField, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class CountryListComponent implements FormValueControl<string | null> {
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(Injector);

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
    getCountriesBasedOnSearch(
      this.standardCountries(),
      this.searchText(),
      this.searchFields()
    )
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

  readonly allowedRegions = input<Continent[]>([]);

  readonly sortBy = input<SortBy | null>(null);

  readonly searchFields = input<SearchField[]>(['name', 'code', 'dialCode']);

  private readonly countryList = computed(() =>
    getAllowedCountries(this.allowedCountryCodes())
  );

  readonly countriesExpectBlocked = computed(() => {
    const withoutBlocked = getFilteredCountries(
      this.countryList(),
      this.blockedCountryCodes()
    );
    const byRegion = filterCountriesByRegions(
      withoutBlocked,
      this.allowedRegions()
    );
    const sort = this.sortBy();
    return sort ? sortCountries(byRegion, sort) : byRegion;
  });

  readonly preferredCountryList = computed(() => {
    const result = getPreferredCountries(
      this.countriesExpectBlocked(),
      this.preferredCountryCodes()
    );
    return getCountriesBasedOnSearch(
      result,
      this.searchText(),
      this.searchFields()
    );
  });

  readonly onCountryChange = output<string>();

  readonly selectedCountry = computed<ICountry | null>(() => {
    const selectedValue = this.value() ?? this.selectedCountryCode();
    if (!selectedValue) {
      return null;
    }
    return (
      this.countriesExpectBlocked().find(
        x => x.code === selectedValue.toUpperCase()
      ) ?? null
    );
  });

  readonly focusedCountryCode = computed<string | null>(() => {
    const list = [...this.preferredCountryList(), ...this.filteredCountries()];
    return list[this.focusedIndex()]?.code ?? null;
  });

  changeCountry(country: ICountry): void {
    this.value.set(country.code);
    this.onCountryChange.emit(country.code);
    this.close();
    this.scrollToFocusedItem();
  }

  toggleList(): void {
    this.displayList.update(isDisplayed => !isDisplayed);
    if (this.displayList() === true) {
      this.displaySearch.set(true);
      this.setFocusedIndex();
      this.scrollToFocusedItem();
      afterNextRender(() => this.search()?.nativeElement.focus(), {
        injector: this.injector,
      });
    }
  }

  private close(): void {
    this.displayList.set(false);
    this.displaySearch.set(false);
    this.searchText.set('');
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    const filteredCountriesLength =
      this.preferredCountryList().length + this.filteredCountries().length;
    if (filteredCountriesLength === 0) {
      return;
    }
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
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const focusedCountry = [
        ...this.preferredCountryList(),
        ...this.filteredCountries(),
      ][this.focusedIndex()];
      if (focusedCountry) {
        this.changeCountry(focusedCountry);
      }
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
      this.focusedIndex.set(selectedIndex === -1 ? 0 : selectedIndex);
    }
  }
}
