import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, inject } from '@angular/core';

export interface PartnerSlide {
  img: string;
  name: string;
  description: string;
  url: string;
}

/**
 * Partners logo strip. Dots/click navigation with wrap-around
 * (replaces Hammer swipe; keyboard/pointer friendly).
 */
@Component({
  selector: 'app-hp-slider-partners',
  imports: [NgClass],
  templateUrl: './hp-slider-partners.component.html',
  styleUrl: './hp-slider-partners.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpSliderPartnersComponent {
  @Input() sliderList: PartnerSlide[] = [];
  @Input() dots = false;

  currentSlider = 0;

  private cdr = inject(ChangeDetectorRef);

  next(): void {
    this.currentSlider = (this.currentSlider + 1) % this.sliderList.length;
    this.cdr.detectChanges();
  }

  prev(): void {
    this.currentSlider = (this.currentSlider - 1 + this.sliderList.length) % this.sliderList.length;
    this.cdr.detectChanges();
  }

  goTo(index: number): void {
    this.currentSlider = index;
    this.cdr.detectChanges();
  }
}
