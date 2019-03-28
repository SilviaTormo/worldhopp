import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpGalleryParalaxComponent } from './hp-gallery-paralax.component';

describe('HpGalleryParalaxComponent', () => {
  let component: HpGalleryParalaxComponent;
  let fixture: ComponentFixture<HpGalleryParalaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpGalleryParalaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpGalleryParalaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
