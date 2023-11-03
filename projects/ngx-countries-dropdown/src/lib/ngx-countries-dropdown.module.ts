import { NgModule } from '@angular/core';
import { CountryListComponent } from './components/country-list/country-list.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    CountryListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    CountryListComponent
  ]
})
export class NgxCountriesDropdownModule { }
