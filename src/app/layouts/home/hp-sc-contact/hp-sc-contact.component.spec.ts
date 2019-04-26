import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScContactComponent } from './hp-sc-contact.component';

describe('HpScContactComponent', () => {
  let component: HpScContactComponent;
  let fixture: ComponentFixture<HpScContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
