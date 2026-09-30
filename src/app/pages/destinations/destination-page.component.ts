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
            @if (d.animatedScene) {
              <svg class="scene-img scene-svg" viewBox="0 0 1070 850" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <!-- Both layers use the exact same supplied illustration. -->
                  <path id="original-cabin" d="M364 92 C354 92 349 99 348 110 C337 109 329 115 328 125 C327 133 334 142 345 143 L327 205 L309 211 C289 211 274 224 274 240 L274 252 C264 256 263 267 270 271 L267 414 C266 429 274 435 285 437 L310 439 L309 445 L327 448 L335 439 L393 439 L405 448 L414 445 L415 437 L443 435 C452 433 455 426 455 415 L455 271 C465 267 460 256 452 255 L452 240 C452 226 436 214 419 211 L401 206 L382 142 C393 141 400 135 400 126 C400 117 391 111 381 110 C380 100 374 93 364 92 Z"/>
                  <clipPath id="cabin-clip"><use href="#original-cabin"/></clipPath>
                  <mask id="remove-static-cabin" maskUnits="userSpaceOnUse" x="0" y="0" width="1070" height="850">
                    <rect width="1070" height="850" fill="white"/>
                    <use href="#original-cabin" fill="black"/>
                  </mask>
                </defs>
                <rect width="1070" height="850" fill="white"/>
                <image [attr.href]="d.heroImage" width="1070" height="850" mask="url(#remove-static-cabin)"/>
                <path d="M20 167 L1070 30" fill="none" stroke="#333" stroke-width="5"/>
                <g class="original-cabin-moving" clip-path="url(#cabin-clip)">
                  <image [attr.href]="d.heroImage" width="1070" height="850"/>
                </g>
              </svg>
            } @else {
              <img class="scene-img" [src]="d.heroImage" [alt]="'Ilustración de ' + d.name" loading="eager" />
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
      .scene-svg { width: auto; overflow: visible; }
      .original-cabin-moving { will-change: transform; }

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
      }
    `,
  ],
})
export class DestinationPageComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  dest = computed(() => getDestination(this.route.snapshot.paramMap.get('slug') ?? ''));

  // Move the original cabin along the cable in the illustration's coordinates.
  private raf = 0;
  private last = 0;
  private progress = 0;
  private running = false;
  private io?: IntersectionObserver;
  private cabin?: SVGGElement;

  ngAfterViewInit(): void {
    const d = this.dest();
    if (!d?.animatedScene) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    this.cabin = this.host.nativeElement.querySelector<SVGGElement>('.original-cabin-moving') ?? undefined;
    if (!this.cabin) return;
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
    this.progress = (this.progress + dt / 26) % 1;
    // At rest the pulley is at x=364, y=119; the cable slopes -137 / 1050.
    const x = this.progress * 1160 - 480;
    const y = -x * 137 / 1050;
    this.cabin?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    this.raf = requestAnimationFrame(this.tick);
  };
}
