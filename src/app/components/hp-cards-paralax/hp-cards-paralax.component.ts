import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

export interface ServiceCard {
  icon?: string;
  title?: string;
  text?: string;
  rellax?: { speed: number };
}

/**
 * Services cards row. Hover lift on desktop (CSS), swipe strip on mobile
 * with native Pointer Events (replaces Hammer.js).
 */
@Component({
  selector: 'app-hp-cards-paralax',
  templateUrl: './hp-cards-paralax.component.html',
  styleUrl: './hp-cards-paralax.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpCardsParalaxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() cards: ServiceCard[] = [];

  isMobile = window.innerWidth <= 750;
  currentSlider = 0;
  sliderWidth = 208;

  private cdr = inject(ChangeDetectorRef);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private resizeObserver?: ResizeObserver;
  private pointerStart: { x: number; index: number } | null = null;

  ngOnInit(): void {
    // Match old template behavior: mobile slide offset with a small margin.
    this.sliderWidth = 218;
  }

  ngAfterViewInit(): void {
    const card = this.host.nativeElement.querySelector<HTMLElement>('.cb-card-box');
    if (card && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        const width = card.getBoundingClientRect().width;
        this.sliderWidth = (this.isMobile ? width + 10 : 0);
      });
      this.resizeObserver.observe(card);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  setAttrAlt(img: string): string {
    return img.replace(/.*\/(.*\..*)$/gm, '$1');
  }

  onPointerDown(event: PointerEvent): void {
    if (!this.isMobile) return;
    this.pointerStart = { x: event.clientX, index: this.currentSlider };
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.pointerStart) return;
    const dx = event.clientX - this.pointerStart.x;
    if (dx < -40 && this.currentSlider < this.cards.length - 1) {
      this.currentSlider++;
    } else if (dx > 40 && this.currentSlider > 0) {
      this.currentSlider--;
    } else {
      this.currentSlider = this.pointerStart.index;
    }
    this.pointerStart = null;
    this.cdr.detectChanges();
  }

  onCardClick(index: number): void {
    if (this.isMobile) {
      this.currentSlider = index;
      this.cdr.detectChanges();
    }
  }
}
