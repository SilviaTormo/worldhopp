import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScLearnEnglishComponent } from './hp-sc-learn-english.component';

describe('HpScLearnEnglishComponent', () => {
  let component: HpScLearnEnglishComponent;
  let fixture: ComponentFixture<HpScLearnEnglishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScLearnEnglishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScLearnEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
