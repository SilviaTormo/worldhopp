import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpSliderExperiencesComponent } from './hp-slider-experiences.component';

describe('HpSliderExperiencesComponent', () => {
  let component: HpSliderExperiencesComponent;
  let fixture: ComponentFixture<HpSliderExperiencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpSliderExperiencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpSliderExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
