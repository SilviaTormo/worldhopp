import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { AgentUiService } from '../agent-ui.service';
import { scrollToTarget } from '../scroll-to';

interface ChatAction {
  label: string;
  intent: string;
}

interface ChatMessage {
  from: 'agent' | 'user';
  text: string;
  actions?: ChatAction[];
  time: string;
}

/**
 * Lightweight "agent" chat panel for the floating ball.
 * Rule-based local intents (no backend, no extra bundle weight):
 *  - Page navigation ("llévame a contacto / equipo / destinos / servicios")
 *  - FAQs about WorldHopp
 *  - Action suggestions rendered as buttons
 */
@Component({
  selector: 'app-agent-chat',
  imports: [NgClass],
  templateUrl: './agent-chat.component.html',
  styleUrl: './agent-chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentChatComponent implements OnInit, OnDestroy {
  readonly ui = inject(AgentUiService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  @ViewChild('scroller') private scroller?: ElementRef<HTMLElement>;
  @ViewChild('chatInput') private chatInput?: ElementRef<HTMLInputElement>;

  readonly open = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly thinking = signal(false);
  readonly quickActions: ChatAction[] = [
    { label: '🧭 Ver destinos', intent: 'destinos' },
    { label: '🤝 Equipo', intent: 'equipo' },
    { label: '✉️ Contacto', intent: 'contacto' },
  ];

  private typingTimer?: ReturnType<typeof setTimeout>;
  private typingDelay = 0;

  /** The floating ball toggles the shared service; this effect opens/closes the panel. */
  constructor() {
    effect(() => {
      const shouldBeOpen = this.ui.chatOpen();
      untracked(() => (shouldBeOpen ? this.openPanel() : this.close()));
    });
  }
  private docKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.open()) {
      this.zone.run(() => this.close());
    }
  };

  ngOnInit(): void {
    document.addEventListener('keydown', this.docKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.docKeydown);
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  toggle(): void {
    this.open() ? this.close() : this.openPanel();
  }

  openPanel(): void {
    if (!this.open()) {
      this.open.set(true);
      this.ui.setChatOpen(true);
      if (this.messages().length === 0) {
        this.pushAgent(
          '¡Hopp! 🦗 Soy el asistente de WorldHopp. Puedo llevarte por la página o resolver tus dudas. ¿Por dónde empezamos?',
          [
            { label: '🧭 Ver destinos', intent: 'destinos' },
            { label: '✉️ Ir a contacto', intent: 'contacto' },
            { label: '❓ ¿Qué es WorldHopp?', intent: 'que es worldhopp' },
          ]
        );
      }
      this.cdr.detectChanges();
      // Focus after the open transition so focus is visible.
      setTimeout(() => this.chatInput?.nativeElement.focus(), 250);
    }
  }

  close(): void {
    this.open.set(false);
    this.ui.setChatOpen(false);
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.thinking.set(false);
    }
    this.cdr.detectChanges();
  }

  sendMessage(): void {
    const input = this.chatInput?.nativeElement;
    const text = input?.value.trim();
    if (!text) {
      return;
    }
    if (input) {
      input.value = '';
    }
    this.pushUser(text);
    this.handleIntent(text.toLowerCase());
  }

  runAction(action: ChatAction): void {
    this.pushUser(action.label);
    this.handleIntent(action.intent.toLowerCase());
  }

  private handleIntent(raw: string): void {
    const reply = this.resolveIntent(raw);
    this.thinking.set(true);
    this.typingDelay = 350 + Math.random() * 450;
    this.typingTimer = setTimeout(() => {
      this.zone.run(() => {
        this.thinking.set(false);
        if (reply.navigate) {
          this.close();
          this.router.navigateByUrl(reply.navigate);
          return;
        }
        if (reply.scrollTarget) {
          // Mobile: the sheet covers the page, so close it first and let the
          // user watch the scroll land on the section. History is kept.
          if (window.matchMedia('(max-width: 920px)').matches) {
            this.close();
          }
          this.scrollTo(reply.scrollTarget);
        }
        this.pushAgent(reply.text, reply.actions);
      });
    }, this.typingDelay);
  }

  private resolveIntent(raw: string): { text: string; actions?: ChatAction[]; scrollTarget?: string; navigate?: string } {
    const has = (...words: string[]): boolean => words.some((w) => raw.includes(w));

    // Destination pages (PlaceHopp)
    if (has('barcelona', 'bcn', 'montju')) {
      return {
        text: 'BARCELONAhopp 🚡: academias top, mar y Montjuïc. Te abro su página con el teleférico en marcha.',
        navigate: '/destino/barcelona',
        actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }],
      };
    }
    if (has('malta', 'valeta', 'sliema')) {
      return {
        text: 'MALTAhopp 🇲🇹: inglés en el Mediterráneo, sol y playa. Abro su página.',
        navigate: '/destino/malta',
        actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }],
      };
    }
    if (has('irlanda', 'ireland', 'dublin', 'irish')) {
      return {
        text: 'IRELANDhopp 🇮🇪: inglés auténtico y trabajo desde el primer día. Te llevo a su página.',
        navigate: '/destino/irlanda',
        actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }],
      };
    }
    if (has('nueva zelanda', 'new zelanda', 'kiwi', 'nz')) {
      return {
        text: 'KIWIhopp 🇳🇿: el salto al otro lado del mundo, con trabajo incluido. Abro su página.',
        navigate: '/destino/nueva-zelanda',
        actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }],
      };
    }

    // Navigation intents
    if (has('contacto', 'contact', 'formulario', 'escribi', 'email', 'correo')) {
      return {
        text: 'Te dejo en el formulario de contacto. Rellena tus datos y el equipo os contesta en menos de 24h laborables. ✉️',
        scrollTarget: '#contact',
        actions: [{ label: '🧭 Ver destinos antes', intent: 'destinos' }],
      };
    }
    if (has('destino', 'destinations', 'ciudad', 'pais', 'viaj')) {
      return {
        text: 'Cuatro destinos: Malta 🇲🇹, Irlanda 🇮🇪, Nueva Zelanda 🇳🇿 y Barcelona 🇪🇸. ¿Cuál te enseño? Cada uno tiene su propia página.',
        scrollTarget: '#destinations',
        actions: [
          { label: '🇲🇹 Malta', intent: 'malta' },
          { label: '🇮🇪 Irlanda', intent: 'irlanda' },
          { label: '🇳🇿 Nueva Zelanda', intent: 'nueva zelanda' },
          { label: '🇪🇸 Barcelona', intent: 'barcelona' },
        ],
      };
    }
    if (has('equipo', 'team', 'quienes', 'silvia')) {
      return {
        text: 'Somos un equipo pequeño que ha vivido la experiencia en primera persona. Te presento a todos en la sección de equipo. 👋',
        scrollTarget: '#team',
        actions: [{ label: '✉️ Contactar', intent: 'contacto' }],
      };
    }
    if (has('servicio', 'service', 'ofrec', 'ayudáis', 'ayudais', 'hacéis', 'haceis')) {
      return {
        text: 'Os acompañamos en todo: elección de destino, matrícula, visado, alojamiento y trabajo. El «hopp» completo, de principio a fin. 🪃',
        scrollTarget: '#services',
      };
    }
    if (has('precio', 'coste', 'cuánto', 'cuanto', 'tarifa')) {
      return {
        text: 'Depende del destino y la duración. En el formulario podéis pedir un presupuesto sin compromiso y os enviamos el detalle. 💬',
        scrollTarget: '#contact',
      };
    }

    // FAQ intents
    if (has('qué es', 'que es', 'worldhopp', 'cómo funciona', 'como funciona')) {
      return {
        text: 'WorldHopp acompaña a jóvenes que quieren estudiar y trabajar en el extranjero: eliges destino, nosotros nos ocupamos de papeleo, alojamiento y trámites. Tú solo da el hopp. 🦗',
        actions: [
          { label: '🧭 Ver destinos', intent: 'destinos' },
          { label: '🛠️ Ver servicios', intent: 'servicios' },
        ],
      };
    }
    if (has('visa', 'visado', 'nuevo zel', 'new zel')) {
      return {
        text: 'Gestionamos la visado working holiday y de estudiante según destino y edad. En la llamada inicial te decimos exactamente qué necesitas. 🛂',
        actions: [{ label: '✉️ Pedir llamada', intent: 'contacto' }],
      };
    }
    if (has('trabajo', 'job', 'empleo')) {
      return {
        text: 'Trabajáis mientras estudiáis: os orientamos con el buscón de empleo local y el CV en inglés. Muchos lo logran en las primeras semanas. 💪',
      };
    }
    if (has('inglés', 'ingles', 'english', 'idioma', 'nivel')) {
      return {
        text: 'No hace falta un nivel mínimo: hay cursos desde elemental. ¡Da igual por dónde empieces, lo importante es empezar! 🗣️',
        scrollTarget: '.hp-s8-learn-english',
      };
    }
    if (has('hola', 'buenas', 'hey', 'buenos días', 'buenas tardes')) {
      return {
        text: '¡Hola! 👋 ¿Qué te apetece ver? Puedo llevarte a destinos, servicios, equipo o contacto.',
        actions: this.quickActions,
      };
    }
    if (has('gracias', 'genial', 'perfecto')) {
      return { text: '¡Un placer! Si te animas, el formulario de contacto está a un clic. 🦗', actions: [{ label: '✉️ Ir a contacto', intent: 'contacto' }] };
    }

    // Fallback
    return {
      text: 'Eso no lo tengo claro todavía 😅. Puedo llevarte a destinos, servicios, equipo o contacto, o contestar dudas sobre visados, precios e inglés.',
      actions: this.quickActions,
    };
  }

  private scrollTo(target: string): void {
    this.zone.runOutsideAngular(() => scrollToTarget(target));
  }

  private pushUser(text: string): void {
    this.messages.update((m) => [...m, { from: 'user', text, time: this.time() }]);
    this.scrollBottom();
  }

  private pushAgent(text: string, actions?: ChatAction[]): void {
    this.messages.update((m) => [...m, { from: 'agent', text, actions, time: this.time() }]);
    this.cdr.detectChanges();
    this.scrollBottom();
  }

  private scrollBottom(): void {
    requestAnimationFrame(() => {
      const el = this.scroller?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  private time(): string {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
