import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScReasonsComponent } from './hp-sc-reasons.component';

describe('HpScReasonsComponent', () => {
  let component: HpScReasonsComponent;
  let fixture: ComponentFixture<HpScReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
