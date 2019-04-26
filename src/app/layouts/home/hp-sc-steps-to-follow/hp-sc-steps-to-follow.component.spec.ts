import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScStepsToFollowComponent } from './hp-sc-steps-to-follow.component';

describe('HpScStepsToFollowComponent', () => {
  let component: HpScStepsToFollowComponent;
  let fixture: ComponentFixture<HpScStepsToFollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScStepsToFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScStepsToFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
