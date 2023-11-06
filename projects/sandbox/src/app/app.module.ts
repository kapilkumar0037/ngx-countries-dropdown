import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxCountriesDropdownModule } from 'projects/ngx-countries-dropdown/src/lib/ngx-countries-dropdown.module';

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
