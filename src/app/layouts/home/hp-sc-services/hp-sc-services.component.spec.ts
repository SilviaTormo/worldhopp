import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScServicesComponent } from './hp-sc-services.component';

describe('HpScServicesComponent', () => {
  let component: HpScServicesComponent;
  let fixture: ComponentFixture<HpScServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
