import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpSliderPartnersComponent } from './hp-slider-partners.component';

describe('HpSliderPartnersComponent', () => {
  let component: HpSliderPartnersComponent;
  let fixture: ComponentFixture<HpSliderPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpSliderPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpSliderPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
