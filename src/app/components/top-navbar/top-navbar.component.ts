import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

export interface MenuAnchor {
  name: string;
  id: string;
  section: string;
}

@Component({
  selector: 'app-top-navbar',
  imports: [NgClass],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() anchors: MenuAnchor[] = [];

  scrollIsUp = true;
  activeId = '';

  private zone = inject(NgZone);
  private router = inject(Router);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  private scrollObserver?: IntersectionObserver;
  private ticking = false;

  ngOnInit(): void {
    // Scroll state (logo grows when at the top): passive rAF-throttled listener.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngAfterViewInit(): void {
    if (this.anchors.length > 0) {
      this.initActiveSectionObserver();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.scrollObserver?.disconnect();
  }

  printLogo(num: number, total: number): boolean {
    return num === total / 2;
  }

  goTo(sectionId: string): void {
    document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  logoEvents(): void {
    if (!this.scrollIsUp) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']);
    }
  }

  private onScroll = (): void => {
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      const up = window.scrollY <= 10;
      if (up !== this.scrollIsUp) {
        this.zone.run(() => (this.scrollIsUp = up));
      }
    });
  };

  /**
   * Replaces ScrollMagic: one IntersectionObserver marks the menu link
   * of the section currently crossing the viewport middle as `.active`.
   */
  private initActiveSectionObserver(): void {
    const sections = this.anchors
      .map((anchor) => document.querySelector(anchor.section))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) {
      // Sections render after their images/layout; retry briefly (same
      // behavior as the old ScrollMagic retry loop).
      setTimeout(() => this.initActiveSectionObserver(), 200);
      return;
    }

    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const anchor = this.anchors.find((a) => document.querySelector(a.section) === entry.target);
          if (anchor && anchor.id !== this.activeId) {
            this.zone.run(() => (this.activeId = anchor.id));
          }
        }
      },
      {
        // A thin horizontal band at the middle of the viewport decides
        // which section is "current".
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );
    sections.forEach((section) => this.scrollObserver!.observe(section));
  }
}
