import { NgModule } from '@angular/core';
import { CountryListComponent } from './components/country-list/country-list.component';

/**
 * @deprecated use `CountryListComponent` directly instead of importing the module.
 */
@NgModule({
  imports: [CountryListComponent],
  exports: [CountryListComponent],
})
export class NgxCountriesDropdownModule { }
