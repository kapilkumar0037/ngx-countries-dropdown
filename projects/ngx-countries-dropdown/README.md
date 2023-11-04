# NGX Countries dropdown

A highly customizable library with no dependencies for angular applications, which provides a countries dropdown component with the following features. This library has been created without using any CSS framework.

## Features
- To create a country dropdown with flags
- Searchable country dropdown
- Use as dial code dropdown
- Use as currency dropdown
- Use as language dropdown
- To create a country dropdown with capitals
- Capability to display preferred countries on top and separate section
- Capability to display only specific countries
- Capability to block specific countries

## Getting started
Hope you already have an angular project, if not please create one using the below commands
```
npm install -g @angular/cli
ng new my-app
cd my-app
ng serve --open
```
1. once the angular application setup is ready, install the Ngx Countries dropdown using the following command
```
npm i ngx-countries-dropdown
```
2. Add the CSS
   Either import the CSS directly to styles.scss file
   ```
   @import  "node_modules/ngx-countries-dropdown/assets/styles.css";
   ```
   Or, add CSS file in angular.json in the styles array in the build section
   ```
    "styles": [
              "node_modules/ngx-countries-dropdown/assets/styles.css",
              "src/styles.scss"
            ],
   ```

3. Import NgxCountriesDropdownModule
   import NgxCountriesDropdownModule in module where you want to add the countries dropdown, it may be app-module, some lazy loaded module or a standalone component
   ```
     imports: [
    NgxCountriesDropdownModule
    ],
   ```
4. Add the country component to the component where is being used

  ```html
  <lib-country-list></lib-country-list>
  ```

### Properties and their usage
####The below table explains what all Input properties country dropdown accepts and their usage
<table role="table">
 <tbody><tr>
  <td>Property</td>
  <td>Type and default values</td>
  <td>Description</td>
 </tr>

 <tr>
  <td><b>preferredCountryCodes</b></td>
  <td>Type: string array(string[]),Default value: []</td>
  <td>Consumer has to provide the list of country codes which needs to be displayed on top section. ex. if user provided ['in', 'us'], India and United States will be displayed on top</td>
 </tr>
 <tr>
  <td><b>blockedCountryCodes</b></td>
  <td>Type: string array(string[]),Default value: []</td>
  <td>an array of country codes which are not required in the list. Ex. if some client is not servicing some specific countries can be removed from the country dropdown using this.  </td>
 </tr>

 <tr>
  <td><b>allowedCountryCodes</b></td>
  <td>Type: string array(string[]),Default value: []</td>
  <td>Only countries which will be displayed in the country list </td>
 </tr>
 <tr>
  <td><b>selectedCountryConfig</b></td>
  <td>Type: <b>IConfig</b> (see table below for IConfig properties), Default value: {}</td>
  <td>Provides config for the selected country, and controls what all will be displayed. Ex. if the user do not want to display flag for the selected item, can be controlled with this property(refer to config table for details)</td>
 </tr>
 <tr>
  <td><b>countryListConfig</b></td>
  <td>Type: <b>IConfig</b> (see table below for IConfig properties), Default value: {}</td>
  <td>Provides config for the country list, and controls what all will be displayed in the country list. Ex. if the user do not want to see flag or dial code or name in the country list, can be controlled with this property(refer to config table for details)</td>
 </tr>

</tbody></table>

### Events
<table role="table">
 <tbody><tr>
  <td><b>onCountryChange</b> </td>
  <td>Country type ICountry </td>
  <td>returns the selected country</td>
 </tr>

</tbody></table>

### IConfig properties and usage
Config properties can be used to control what will be displayed in the country list and for the selected country.
Exported interface 
```
export interface IConfig {
  hideFlag?: boolean;
  hideCode?: boolean;
  hideName?: boolean;
  hideSearch?: boolean;
  hideDialCode?: boolean;
  displayCapital?: boolean;
  displayLanguageCode?: boolean;
  displayLanguageName?: boolean;
  displayCurrencyCode?: boolean
  displayCurrencyName?: boolean
  displayCurrencySymbol?: boolean
  
}
```
