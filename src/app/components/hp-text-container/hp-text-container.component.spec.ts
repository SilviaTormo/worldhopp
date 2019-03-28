import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpTextContainerComponent } from './hp-text-container.component';

describe('HpTextContainerComponent', () => {
  let component: HpTextContainerComponent;
  let fixture: ComponentFixture<HpTextContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpTextContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpTextContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
