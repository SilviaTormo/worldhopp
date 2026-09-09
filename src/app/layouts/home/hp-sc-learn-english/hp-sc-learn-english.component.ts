import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

/**
 * "Aprende inglés" section with the looping typewriter. A ~30-line
 * typed-effect (replaces the typed.js dependency) that stops when the
 * element leaves the viewport and cleans up on destroy.
 */
@Component({
  selector: 'app-hp-sc-learn-english',
  imports: [HpTextContainerComponent, RevealDirective],
  templateUrl: './hp-sc-learn-english.component.html',
  styleUrl: './hp-sc-learn-english.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScLearnEnglishComponent implements AfterViewInit, OnDestroy {
  content = {
    title: 'Aprende inglés',
    title2: 'mientras ves mundo',
    paragraph:
      'Te ofrecemos los mejores cursos de inglés, tecnología, deportes, etc.. para estudiar en el extranjero. Worldhopp representa a las mejores instituciones en las ciudades principales.',
  };

  private zone = inject(NgZone);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  private timer?: ReturnType<typeof setTimeout>;
  private observer?: IntersectionObserver;
  private strings = ['Inglés.', 'Tecnología', 'Deporte'];
  private running = false;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement.querySelector<HTMLElement>('.typed-element');
    if (!el || typeof IntersectionObserver === 'undefined') {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.running) {
            this.running = true;
            this.typeLoop(el, 0, 0, true);
          } else if (!entry.isIntersecting && this.running) {
            this.running = false;
            if (this.timer) {
              clearTimeout(this.timer);
            }
          }
        }
      },
      { threshold: 0.3 }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.observer?.disconnect();
  }

  private typeLoop(el: HTMLElement, stringIndex: number, charIndex: number, deleting: boolean): void {
    if (!this.running) {
      return;
    }
    const current = this.strings[stringIndex];
    el.textContent = current.slice(0, charIndex) + '|';

    let nextString = stringIndex;
    let nextChar = charIndex;
    let nextDeleting = deleting;
    let delay = 110;

    if (!deleting) {
      if (charIndex < current.length) {
        nextChar++;
      } else {
        nextDeleting = true;
        delay = 1800;
      }
    } else {
      if (charIndex > 0) {
        nextChar--;
        delay = 60;
      } else {
        nextDeleting = false;
        nextString = (stringIndex + 1) % this.strings.length;
        delay = 400;
      }
    }

    this.timer = setTimeout(() => this.typeLoop(el, nextString, nextChar, nextDeleting), delay);
  }
}
