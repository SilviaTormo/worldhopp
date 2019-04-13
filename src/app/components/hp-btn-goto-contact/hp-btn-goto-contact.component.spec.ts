import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpBtnGotoContactComponent } from './hp-btn-goto-contact.component';

describe('HpBtnGotoContactComponent', () => {
  let component: HpBtnGotoContactComponent;
  let fixture: ComponentFixture<HpBtnGotoContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpBtnGotoContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpBtnGotoContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
