import { NgClass } from '@angular/common';
import { LazyBgDirective } from '../../shared/lazy-bg.directive';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';

export interface ExperienceSlide {
  photo: string;
  user: string;
  nombre: string;
  comment: string;
  origen: string;
  destino: string;
}

/**
 * Testimonials slider. Pointer-drag with live tracking and momentum-ish
 * threshold, dots navigation (replaces Hammer.js pan logic).
 */
@Component({
  selector: 'app-hp-slider-experiences',
  imports: [NgClass, LazyBgDirective],
  templateUrl: './hp-slider-experiences.component.html',
  styleUrl: './hp-slider-experiences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpSliderExperiencesComponent implements OnDestroy {
  @Input() sliderList: ExperienceSlide[] = [];

  currentSlider = 1;
  dragging = false;
  dragDelta = 0;

  private cdr = inject(ChangeDetectorRef);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private resizeObserver?: ResizeObserver;
  private dragStartX = 0;

  constructor() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.cdr.detectChanges());
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  transformStyle(): string {
    return `translateX(-${this.currentSlider * 100}%)`;
  }

  goTo(index: number): void {
    this.currentSlider = Math.max(0, Math.min(this.sliderList.length - 1, index));
    this.cdr.detectChanges();
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    this.dragDelta = 0;
    this.dragStartX = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    this.dragDelta = event.clientX - this.dragStartX;
    this.cdr.detectChanges();
  }

  onPointerUp(): void {
    if (!this.dragging) return;
    const w = this.listWidth() || 1;
    const threshold = Math.min(80, w / 4);
    if (this.dragDelta < -threshold && this.currentSlider < this.sliderList.length - 1) {
      this.currentSlider++;
    } else if (this.dragDelta > threshold && this.currentSlider > 0) {
      this.currentSlider--;
    }
    this.dragging = false;
    this.dragDelta = 0;
    this.cdr.detectChanges();
  }

  private listWidth(): number {
    const list = this.host.nativeElement.querySelector<HTMLElement>('.slider-list');
    return list ? list.getBoundingClientRect().width : 0;
  }
}
