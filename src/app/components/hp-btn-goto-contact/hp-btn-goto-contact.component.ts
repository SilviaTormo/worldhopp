import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

/**
 * Floating "Te ayudamos a dar el hopp" button. On mobile it becomes a
 * bottom bar that hides while the user scrolls down and reappears on
 * scroll end — measured with rAF-throttled passive listeners (replaces
 * the old touchstart/touchmove/touchend + resize handlers).
 */
@Component({
  selector: 'app-hp-btn-goto-contact',
  imports: [NgClass],
  templateUrl: './hp-btn-goto-contact.component.html',
  styleUrl: './hp-btn-goto-contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpBtnGotoContactComponent implements OnDestroy {
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  isMobile = window.innerWidth <= 920;
  hideBanner = false;

  private lastY = window.scrollY;
  private ticking = false;
  private hideTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  }

  goToContactForm(): void {
    document.querySelector('.hp-s9-contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  private onScroll = (): void => {
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      const y = window.scrollY;
      const goingDown = y > this.lastY;
      this.lastY = y;

      if (!this.isMobile) {
        return;
      }
      // Hide while scrolling down; show again shortly after stopping.
      if (goingDown && !this.hideBanner) {
        this.hideBanner = true;
        this.cdr.detectChanges();
      }
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }
      this.hideTimer = setTimeout(() => {
        this.zone.run(() => {
          this.hideBanner = false;
          this.cdr.detectChanges();
        });
      }, 250);
    });
  };

  private onResize = (): void => {
    const mobile = window.innerWidth <= 920;
    if (mobile !== this.isMobile) {
      this.zone.run(() => {
        this.isMobile = mobile;
        this.cdr.detectChanges();
      });
    }
  };
}
