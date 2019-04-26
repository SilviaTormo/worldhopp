import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScExperiencesComponent } from './hp-sc-experiences.component';

describe('HpScExperiencesComponent', () => {
  let component: HpScExperiencesComponent;
  let fixture: ComponentFixture<HpScExperiencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScExperiencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
