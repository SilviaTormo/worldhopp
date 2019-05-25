import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScSocialComponent } from './hp-sc-social.component';

describe('HpScSocialComponent', () => {
  let component: HpScSocialComponent;
  let fixture: ComponentFixture<HpScSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
