import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpBtnGotoContactComponent } from '../../../components/hp-btn-goto-contact/hp-btn-goto-contact.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';

interface StarSpec {
  size: number;
  color: string;
  pos: { x: number; y: number };
}

/**
 * Contact section with the floating "stars" decoration. Same look as the
 * original (max 40 living stars, green/blue/yellow, fade in/out) but with
 * bounded timeouts and full cleanup on destroy.
 */
@Component({
  selector: 'app-hp-sc-contact',
  imports: [HpTextContainerComponent, HpBtnGotoContactComponent, RevealDirective],
  templateUrl: './hp-sc-contact.component.html',
  styleUrl: './hp-sc-contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScContactComponent implements AfterViewInit, OnDestroy {
  content = {
    title: '¿Quieres dar el Hopp?',
    paragraph: 'Contáctanos! Te contestaremos cuanto antes.',
  };

  nationalitiesAvailable = ['España', 'Chile', 'Brasil'];

  private maxStars = 40;
  private starLifeTime = 6000;
  private colors = ['green', 'blue', 'yellow'];

  @ViewChild('starCanvas') starCanvas?: ElementRef<HTMLElement>;

  private zone = inject(NgZone);
  private timers: ReturnType<typeof setTimeout>[] = [];
  private starCount = 0;

  ngAfterViewInit(): void {
    if (!this.starCanvas) {
      return;
    }
    this.zone.runOutsideAngular(() => this.generateStar());
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.starCanvas) {
      this.starCanvas.nativeElement.innerHTML = '';
    }
  }

  private generateStar(): void {
    const canvas = this.starCanvas?.nativeElement;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const star = this.setStar(rect.width, rect.height);
    const el = document.createElement('div');
    el.className = `star star-${star.color}`;
    el.style.width = `${star.size}px`;
    el.style.height = `${star.size}px`;
    el.style.top = `${star.pos.y}px`;
    el.style.left = `${star.pos.x}px`;
    canvas.appendChild(el);
    this.starCount++;

    this.timers.push(
      setTimeout(() => {
        el.classList.add('star-dying');
        this.timers.push(
          setTimeout(() => {
            el.remove();
            this.starCount--;
            this.generateStar();
          }, this.starLifeTime)
        );
      }, this.starLifeTime)
    );

    if (this.starCount < this.maxStars) {
      this.generateStar();
    }
  }

  private setStar(width: number, height: number): StarSpec {
    return {
      size: this.random(4, 10),
      color: this.colors[this.random(0, this.colors.length - 1)],
      pos: { x: this.random(0, width), y: this.random(0, height) },
    };
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
