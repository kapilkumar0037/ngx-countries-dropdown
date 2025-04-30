import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryListStandaloneComponent } from './country-list-standalone.component';

describe('CountryListStandaloneComponent', () => {
  let component: CountryListStandaloneComponent;
  let fixture: ComponentFixture<CountryListStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryListStandaloneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryListStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
