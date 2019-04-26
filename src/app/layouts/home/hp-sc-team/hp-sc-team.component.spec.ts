import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpScTeamComponent } from './hp-sc-team.component';

describe('HpScTeamComponent', () => {
  let component: HpScTeamComponent;
  let fixture: ComponentFixture<HpScTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpScTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpScTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
