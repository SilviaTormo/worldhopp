import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getDestination } from './destination.data';
/**
 * PlaceHopp destination template: hero with illustration scene
 * (Barcelona adds a moving cable car), stats, highlights, photos and CTA.
 */
@Component({
  selector: 'app-destination-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dest(); as d) {
      <div class="dest" [style.--accent]="d.accent" [style.--accent-soft]="d.accentSoft">
        <header class="topbar">
          <a class="logo" routerLink="/" aria-label="WorldHopp - inicio">
            <img src="img/saltamontes.svg" alt="" width="44" height="44" />
            <span>worldhopp</span>
          </a>
          <a class="back" routerLink="/">← Volver</a>
        </header>

        <section class="hero">
          <div class="hero-scene" aria-hidden="true">
            <img class="scene-img" [src]="d.heroImage" [alt]="'Ilustración de ' + d.name" loading="eager" />
            @if (d.animatedScene) {
              <div class="cable"></div>
              <div class="car car-a">
                <svg viewBox="0 0 64 54" width="64" height="54">
                  <path d="M32 0 L32 8" stroke="var(--accent)" stroke-width="3" />
                  <rect x="30" y="6" width="4" height="6" rx="1" fill="#1d1c3c" />
                  <rect x="8" y="12" width="48" height="34" rx="10" fill="#1d1c3c" />
                  <rect x="13" y="17" width="24" height="14" rx="5" fill="#f7d13d" />
                  <rect x="41" y="17" width="10" height="24" rx="4" fill="#e8674f" />
                  <rect x="16" y="35" width="12" height="6" rx="3" fill="#ffffff" opacity=".85" />
                </svg>
              </div>
              <div class="car car-b">
                <svg viewBox="0 0 64 54" width="52" height="44">
                  <path d="M32 0 L32 8" stroke="var(--accent)" stroke-width="3" />
                  <rect x="30" y="6" width="4" height="6" rx="1" fill="#1d1c3c" />
                  <rect x="8" y="12" width="48" height="34" rx="10" fill="#1d1c3c" />
                  <rect x="13" y="17" width="24" height="14" rx="5" fill="#f7d13d" />
                  <rect x="41" y="17" width="10" height="24" rx="4" fill="#e8674f" />
                  <rect x="16" y="35" width="12" height="6" rx="3" fill="#ffffff" opacity=".85" />
                </svg>
              </div>
            }
          </div>

          <div class="hero-copy">
            <p class="kicker">PlaceHopp · {{ d.name }}</p>
            <h1>{{ d.hoppName }}</h1>
            <p class="tagline">{{ d.tagline }}</p>
            <div class="cta-row">
              <a class="btn primary" routerLink="/" fragment="contact">Pedir info</a>
              <a class="btn ghost" routerLink="/" fragment="services">Cómo funciona</a>
            </div>
          </div>
        </section>

        <section class="stats">
          @for (s of d.stats; track s.label) {
            <div class="stat">
              <span class="value">{{ s.value }}</span>
              <span class="label">{{ s.label }}</span>
            </div>
          }
        </section>

        <section class="body">
          <p class="intro">{{ d.intro }}</p>
          <div class="highlights">
            @for (h of d.highlights; track h.title) {
              <article class="card">
                <span class="icon" aria-hidden="true">{{ h.icon }}</span>
                <h2>{{ h.title }}</h2>
                <p>{{ h.text }}</p>
              </article>
            }
          </div>
          <div class="photos">
            @for (p of d.photos; track p.src) {
              <img [src]="p.src" [alt]="p.alt" loading="lazy" />
            }
          </div>
        </section>

        <section class="final-cta">
          <h2>¿List@ para tu {{ d.hoppName }}?</h2>
          <a class="btn primary big" routerLink="/" fragment="contact">Hablemos</a>
        </section>
      </div>
    } @else {
      <div class="dest notfound">
        <h1>Este destino todavía no existe 🦘</h1>
        <a class="btn primary" routerLink="/">Volver a inicio</a>
      </div>
    }
  `,
  styles: [
    `
      :host { display: block; min-height: 100vh; background: #fff; }
      .dest { --accent: #1d1c3c; --accent-soft: rgba(29, 28, 60, 0.08); font-family: inherit; color: #1d1c3c; }
      .notfound { min-height: 100vh; display: grid; place-content: center; text-align: center; gap: 20px; }

      .topbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; position: sticky; top: 0; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); z-index: 10; }
      .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #1d1c3c; font-weight: 800; font-size: 20px; }
      .back { text-decoration: none; color: #1d1c3c; font-weight: 600; padding: 8px 14px; border-radius: 999px; background: var(--accent-soft); }

      .hero { position: relative; overflow: hidden; padding: 30px 6vw 60px; background: linear-gradient(180deg, var(--accent-soft), transparent); }
      .hero-scene { position: absolute; inset: 0; pointer-events: none; }
      .scene-img { position: absolute; right: -2%; bottom: 0; height: 78%; max-height: 520px; opacity: 0.95; }
      .cable { position: absolute; left: 0; right: 0; top: 18%; height: 2px; background: #1d1c3c; opacity: 0.5; }
      .car { position: absolute; top: calc(18% - 44px); will-change: transform; filter: drop-shadow(0 4px 8px rgba(29,28,60,0.25)); }
      .car-b { top: calc(18% - 36px); }
      .car-b svg { transform: scaleX(-1); }

      .hero-copy { position: relative; max-width: 560px; padding-top: 40px; }
      .kicker { font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); font-size: 13px; }
      h1 { font-size: clamp(44px, 7vw, 76px); line-height: 1; margin: 10px 0 14px; }
      .tagline { font-size: 20px; opacity: 0.85; }
      .cta-row { display: flex; gap: 14px; margin-top: 26px; }
      .btn { display: inline-block; padding: 12px 26px; border-radius: 999px; font-weight: 700; text-decoration: none; cursor: pointer; border: 2px solid transparent; }
      .btn.primary { background: var(--accent); color: #fff; }
      .btn.ghost { border-color: var(--accent); color: var(--accent); background: transparent; }
      .btn.big { font-size: 18px; padding: 16px 34px; }

      .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 0 6vw; margin: -30px 0 40px; position: relative; }
      .stat { background: #fff; border-radius: 16px; padding: 18px 10px; text-align: center; box-shadow: 0 10px 30px rgba(29,28,60,0.08); display: grid; gap: 4px; }
      .stat .value { font-weight: 800; font-size: clamp(16px, 2vw, 22px); color: var(--accent); }
      .stat .label { font-size: 12px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.06em; }

      .body { padding: 0 6vw 60px; max-width: 1100px; margin: 0 auto; }
      .intro { font-size: 18px; line-height: 1.65; opacity: 0.9; max-width: 720px; }
      .highlights { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-top: 34px; }
      .card { background: var(--accent-soft); border-radius: 18px; padding: 22px; }
      .card .icon { font-size: 28px; }
      .card h2 { font-size: 18px; margin: 10px 0 8px; }
      .card p { font-size: 14.5px; line-height: 1.55; opacity: 0.85; }
      .photos { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 34px; }
      .photos img { width: 100%; height: 260px; object-fit: cover; border-radius: 18px; }

      .final-cta { text-align: center; padding: 60px 6vw 90px; background: var(--accent-soft); }
      .final-cta h2 { font-size: clamp(24px, 4vw, 34px); margin-bottom: 22px; }

      @media (max-width: 920px) {
        .scene-img { height: 52%; right: -6%; opacity: 0.6; }
        .hero-copy { padding-top: 20px; max-width: 100%; }
        .stats { grid-template-columns: repeat(2, 1fr); margin-top: -20px; }
        .photos { grid-template-columns: 1fr; }
        .photos img { height: 200px; }
        .car { top: calc(18% - 34px); }
        .car svg { width: 48px; height: 40px; }
      }
    `,
  ],
})
export class DestinationPageComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  dest = computed(() => getDestination(this.route.snapshot.paramMap.get('slug') ?? ''));

  // Cable-car ride: rAF-driven (CSS animations stay frozen for offscreen
  // elements in some embedded browsers). Two cars cross in opposite dirs.
  private raf = 0;
  private last = 0;
  private progress = [0.1, 0.62];
  private readonly speeds = [1 / 26, 1 / 34];
  private running = false;
  private io?: IntersectionObserver;
  private els: HTMLElement[] = [];

  ngAfterViewInit(): void {
    const d = this.dest();
    if (!d?.animatedScene || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.io = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      visible ? this.start() : this.stop();
    });
    this.io.observe(this.host.nativeElement.querySelector('.hero-scene')!);
  }

  ngOnDestroy(): void {
    this.stop();
    this.io?.disconnect();
  }

  private start(): void {
    if (this.running) return;
    this.els = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.car'));
    if (this.els.length === 0) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min(64, now - this.last) / 1000;
    this.last = now;
    const els = this.els;
    const w = this.host.nativeElement.clientWidth || window.innerWidth;
    for (let i = 0; i < els.length; i++) {
      this.progress[i] = (this.progress[i] + dt * this.speeds[i]) % 1;
      const p = this.progress[i];
      const span = w + 200;
      const x = i === 0 ? -100 + p * span : w + 100 - p * span;
      const bob = Math.sin(p * Math.PI * 4) * 3;
      els[i].style.transform = `translate3d(${x.toFixed(1)}px, ${bob.toFixed(1)}px, 0)`;
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}
