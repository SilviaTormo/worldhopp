import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpCardsParalaxComponent } from './hp-cards-paralax.component';

describe('HpCardsParalaxComponent', () => {
  let component: HpCardsParalaxComponent;
  let fixture: ComponentFixture<HpCardsParalaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpCardsParalaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpCardsParalaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
