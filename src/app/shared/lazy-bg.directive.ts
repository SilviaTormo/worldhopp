import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Sets `background-image` only when the element is about to enter the
 * viewport (300px margin), so below-the-fold imagery never competes with
 * the LCP hero for bandwidth. Falls back to eager loading without IO.
 */
@Directive({
  selector: '[appLazyBg]',
})
export class LazyBgDirective implements OnInit, OnDestroy {
  @Input('appLazyBg') src = '';

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    if (!this.src) {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      node.style.backgroundImage = `url('${this.src}')`;
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.style.backgroundImage = `url('${this.src}')`;
            this.io?.disconnect();
            this.io = undefined;
            break;
          }
        }
      },
      { rootMargin: '300px 0px' }
    );
    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
