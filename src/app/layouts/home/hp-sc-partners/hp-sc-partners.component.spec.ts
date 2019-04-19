import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScPartnersComponent } from './hp-sc-partners.component';

describe('HpScPartnersComponent', () => {
  let component: HpScPartnersComponent;
  let fixture: ComponentFixture<HpScPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
