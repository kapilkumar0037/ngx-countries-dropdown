import { NgModule } from '@angular/core';
import { CountryListComponent } from './components/country-list/country-list.component';

/**
 * @deprecated
 */
@NgModule({
  imports: [CountryListComponent],
  exports: [CountryListComponent],
})
export class NgxCountriesDropdownModule {}
