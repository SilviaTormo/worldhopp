import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpSidebarDoYouLackAHoppComponent } from './hp-sidebar-do-you-lack-a-hopp.component';

describe('HpSidebarDoYouLackAHoppComponent', () => {
  let component: HpSidebarDoYouLackAHoppComponent;
  let fixture: ComponentFixture<HpSidebarDoYouLackAHoppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpSidebarDoYouLackAHoppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpSidebarDoYouLackAHoppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
