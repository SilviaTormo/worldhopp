import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartphoneSocialComponent } from './smartphone-social.component';

describe('SmartphoneSocialComponent', () => {
  let component: SmartphoneSocialComponent;
  let fixture: ComponentFixture<SmartphoneSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartphoneSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartphoneSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
