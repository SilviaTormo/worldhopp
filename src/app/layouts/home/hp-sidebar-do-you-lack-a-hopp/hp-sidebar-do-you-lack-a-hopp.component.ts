import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';

export interface SidebarCard {
  image: string;
  title: string;
  text: string;
}

/**
 * Full-screen sidebar with the 10 reasons to Hopp. The header title
 * parallax is a small rAF-throttled scroll effect on the sidebar's own
 * scroll container.
 */
@Component({
  selector: 'app-hp-sidebar-do-you-lack-a-hopp',
  imports: [NgClass],
  templateUrl: './hp-sidebar-do-you-lack-a-hopp.component.html',
  styleUrl: './hp-sidebar-do-you-lack-a-hopp.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpSidebarDoYouLackAHoppComponent implements OnDestroy {
  @Input() cards: SidebarCard[] = [];
  @Output() actionToExport = new EventEmitter<{ action: string; data?: unknown }>();

  hideSideBar = false;
  isMobile = window.innerWidth <= 920;

  private zone = inject(NgZone);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  private ticking = false;
  private pendingTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    document.documentElement.style.overflow = 'hidden';
    this.zone.runOutsideAngular(() => {
      const scroller = this.host.nativeElement.querySelector('.sidebar');
      scroller?.addEventListener('scroll', this.onSidebarScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    document.documentElement.style.overflow = '';
    this.host.nativeElement.querySelector('.sidebar')?.removeEventListener('scroll', this.onSidebarScroll);
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
    }
  }

  closeSideBar(): void {
    this.hideSideBar = true;
    const delay = this.isMobile ? 200 : 400;
    this.pendingTimer = setTimeout(() => this.exportAction('close'), delay);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  goToContact(): void {
    this.closeSideBar();
    setTimeout(() => {
      document.querySelector('.hp-s9-contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  }

  exportAction(actionName: string, data: unknown = {}): void {
    this.actionToExport.emit({ action: actionName, data });
  }

  private onSidebarScroll = (): void => {
    if (this.ticking) {
      return;
    }
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      const header = this.host.nativeElement.querySelector<HTMLElement>('.sb-header');
      const title = this.host.nativeElement.querySelector<HTMLElement>('.sb-header>div');
      if (!header || !title) {
        return;
      }
      const headerHeight = header.getBoundingClientRect().height;
      const scrollPos = (this.host.nativeElement.querySelector('.sidebar') as HTMLElement).scrollTop;
      let calcPercent = scrollPos / (headerHeight / 2.5);
      if (calcPercent > 1) {
        calcPercent = 1;
      }
      const percentScroll = (scrollPos / headerHeight) * 100 > 50 ? 50 : (scrollPos / headerHeight) * 100;
      const getValue = (percentScroll * 200) / headerHeight;
      title.style.opacity = String(1 - calcPercent);
      title.style.marginBottom = `-${getValue}px`;
    });
  };
}
