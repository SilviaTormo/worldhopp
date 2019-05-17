import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeFollowMyCursorComponent } from './eye-follow-my-cursor.component';

describe('EyeFollowMyCursorComponent', () => {
  let component: EyeFollowMyCursorComponent;
  let fixture: ComponentFixture<EyeFollowMyCursorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EyeFollowMyCursorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeFollowMyCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
