import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScOurDestinationsComponent } from './hp-sc-our-destinations.component';

describe('HpScOurDestinationsComponent', () => {
  let component: HpScOurDestinationsComponent;
  let fixture: ComponentFixture<HpScOurDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScOurDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScOurDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
