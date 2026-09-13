import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { LazyBgDirective } from '../../shared/lazy-bg.directive';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

export interface GalleryImage {
  img?: {
    path: string;
    text?: string;
    textVisibility?: 0 | 1 | 2;
    color?: string;
  };
  title?: {
    text: string;
    textVisibility?: 0 | 1 | 2;
    color?: string;
  };
  rellax?: { speed: number };
  /** Optional route (e.g. /destino/malta) opened when the card is clicked. */
  link?: string;
}

export interface GalleryConfig {
  steps?: boolean;
  rellax?: boolean;
  images: GalleryImage[];
}

/**
 * Destination/team/steps gallery. Parallax is done with one rAF loop that
 * translates visible boxes (replaces Rellax); on mobile it becomes a
 * swipeable strip using native Pointer Events (replaces Hammer.js).
 */
@Component({
  selector: 'app-hp-gallery-paralax',
  imports: [NgClass, LazyBgDirective],
  templateUrl: './hp-gallery-paralax.component.html',
  styleUrl: './hp-gallery-paralax.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpGalleryParalaxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() gallery!: GalleryConfig;

  isMobile = window.innerWidth <= 920;
  currentSlider = 0;
  sliderWidth = 800;
  cardOffset = 0;

  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private router = inject(Router);
  private dragged = false;

  private boxes: HTMLElement[] = [];
  private visible = new Set<HTMLElement>();
  private galleryObserver?: IntersectionObserver;
  private rafId = 0;
  private resizeObserver?: ResizeObserver;
  private pointerStart: { x: number; index: number } | null = null;

  ngOnInit(): void {
    this.checkWindowWidth();
  }

  ngAfterViewInit(): void {
    this.setupParallax();
    this.setupSliderWidth();
  }

  ngOnDestroy(): void {
    this.galleryObserver?.disconnect();
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.rafId);
  }

  checkVisibility(item?: { text?: string; textVisibility?: 0 | 1 | 2 }): boolean {
    if (item !== undefined && item.text !== undefined && item.textVisibility !== undefined) {
      if (item.textVisibility === 0 && this.isMobile) return true;
      if (item.textVisibility === 1 && !this.isMobile) return true;
      if (item.textVisibility === 2) return true;
    }
    return false;
  }

  getFormat(text: string): string {
    if (/^[\w]+hopp$/.test(text)) {
      return text.replace(/^([\w]+)hopp$/, '$1') + '<span class="hopp-name">hopp</span>';
    }
    return text;
  }

  onPointerDown(event: PointerEvent): void {
    if (!this.isMobile) return;
    this.dragged = false;
    this.pointerStart = { x: event.clientX, index: this.currentSlider };
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.pointerStart) return;
    const dx = event.clientX - this.pointerStart.x;
    if (Math.abs(dx) > 10) this.dragged = true;
    if (dx < -40 && this.currentSlider < this.gallery.images.length - 1) {
      this.currentSlider++;
    } else if (dx > 40 && this.currentSlider > 0) {
      this.currentSlider--;
    } else {
      this.currentSlider = this.pointerStart.index;
    }
    this.pointerStart = null;
    this.cdr.detectChanges();
  }

  onImageClick(index: number): void {
    if (this.isMobile) {
      this.currentSlider = index;
      this.cdr.detectChanges();
    }
    // Navigate unless the gesture was a swipe (mobile strip).
    const link = this.gallery.images[index]?.link;
    if (link && !this.dragged) {
      this.router.navigateByUrl(link);
    }
  }

  private checkWindowWidth(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 920;
    if (wasMobile && !this.isMobile) {
      this.currentSlider = 0;
    }
  }

  private setupParallax(): void {
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.boxes = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.gb-image-box'));
    if (this.boxes.length === 0 || !this.gallery.rellax) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.galleryObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.visible.add(entry.target as HTMLElement);
            } else {
              this.visible.delete(entry.target as HTMLElement);
            }
          }
          if (this.visible.size > 0 && this.rafId === 0) {
            this.rafId = requestAnimationFrame(this.parallaxFrame);
          }
        },
        { rootMargin: '15% 0px 15% 0px' }
      );
      this.boxes.forEach((box) => this.galleryObserver!.observe(box));

      const tick = () => {
        this.rafId = this.visible.size > 0 ? requestAnimationFrame(this.parallaxFrame) : 0;
      };
      this.parallaxFrame = () => {
        const viewportCenter = window.innerHeight / 2;
        this.visible.forEach((box) => {
          const speed = Number(box.dataset['rellaxSpeed'] ?? 0);
          if (!speed) return;
          const rect = box.getBoundingClientRect();
          const delta = rect.top + rect.height / 2 - viewportCenter;
          box.style.transform = `translate3d(0, ${(delta * speed * 0.08).toFixed(2)}px, 0)`;
        });
        tick();
      };
    });
  }

  private parallaxFrame: () => void = () => undefined;

  private setupSliderWidth(): void {
    const box = this.host.nativeElement.querySelector<HTMLElement>('.gb-ib-image');
    if (box) {
      this.sliderWidth = box.getBoundingClientRect().width + 10;
    }
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (box) {
          this.sliderWidth = box.getBoundingClientRect().width + 10;
        }
      });
      if (box) {
        this.resizeObserver.observe(box);
      }
    }
  }
}
