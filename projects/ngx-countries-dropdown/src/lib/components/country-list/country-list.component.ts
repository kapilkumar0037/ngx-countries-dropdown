import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { IConfig, ICountry } from '../../models';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'lib-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit {
  searchText = '';
  countryList: ICountry[] = [];
  preferredCountryList: ICountry[] = [];
  countriesExpectBlocked: ICountry[] = [];
  filteredCountries: ICountry[] = [];
  selectedCountry: ICountry = {};
  displayList = false;
  @Input() preferredCountryCodes: string[] = [];
  @Input() blockedCountryCodes: string[] = [];
  @Input() allowedCountryCodes: string[] = [];
  @Input() selectedCountryConfig:IConfig = {}
  @Input() countryListConfig:IConfig = {}
  @Output() onCountryChange = new EventEmitter();
  constructor(private service: CountryService) {}

  ngOnInit(): void {
    this.countryList = this.service.getAllAllowedCountries(this.allowedCountryCodes);
    this.countriesExpectBlocked = this.service.getFilteredCountries(
      this.countryList,
      this.blockedCountryCodes
    );
    this.preferredCountryList = this.service.setPreferredCountries(
      this.countriesExpectBlocked,
      this.preferredCountryCodes
    );
    this.filteredCountries = this.service.getStandardCountries();
  }

  changeCountry(country: ICountry) {
    this.selectedCountry = country;
    this.displayList = false;
    this.onCountryChange.emit(this.selectedCountry);
  }

  toggleList() {
    this.displayList = !this.displayList;
  }
  search() {
    this.preferredCountryList = this.service.getCountriesBasedOnSearch(
      this.service.getPreferredCountries(),
      this.searchText
    );
    this.filteredCountries = this.service.getCountriesBasedOnSearch(
      this.service.getStandardCountries(),
      this.searchText
    );
  }

  @HostListener('document:click', ['$event']) 
  onDocumentClick(event:any) {    
    this.displayList = false;
  }
}
