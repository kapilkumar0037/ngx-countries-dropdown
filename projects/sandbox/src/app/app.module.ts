import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxCountriesDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
