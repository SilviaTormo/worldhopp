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
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { AgentUiService } from '../agent-ui.service';
import { AgentEngine, AgentStep } from '../job-agent/agent-engine';
import { JobAgentStore } from '../job-agent/job-agent.store';
import { scrollToTarget } from '../scroll-to';

interface ChatAction {
  label: string;
  intent: string;
}

interface ChatMessage {
  from: 'agent' | 'user';
  text: string;
  actions?: ChatAction[];
  /** Tool steps reported by the agent engine (chips under the bubble). */
  steps?: AgentStep[];
  time: string;
}

/**
 * The floating ball's chat, powered by the WorldHopp agent engine:
 *  - Site navigation + FAQ intents resolve instantly and locally.
 *  - Everything else goes to the configured engine — Google Gemini when an
 *    AI Studio key is set (gear icon in the header), otherwise a hint to
 *    connect it plus site guidance.
 *  - Tool steps the model reports render as chips and are logged in the
 *    agent store for the activity trail.
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
  readonly engine = inject(AgentEngine);
  readonly store = inject(JobAgentStore);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  @ViewChild('scroller') private scroller?: ElementRef<HTMLElement>;
  @ViewChild('chatInput') private chatInput?: ElementRef<HTMLInputElement>;

  readonly open = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly thinking = signal(false);
  readonly showSettings = signal(false);

  /** Gemini is active when it is the chosen engine and a key is present. */
  readonly remoteReady = computed(() => {
    const s = this.store.settings();
    return s.engine === 'gemini' && !!s.apiKey;
  });

  readonly statusLabel = computed(() => (this.remoteReady() ? 'Gemini conectado' : 'modo guía'));

  /** Curated Gemini models (Google AI Studio); a saved non-Gemini name is kept as an extra option. */
  readonly geminiModels = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'];

  onModelChange(event: Event): void {
    this.store.updateSettings({ model: (event.target as HTMLSelectElement).value });
  }

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
      // The ball is the agent's home: prefer Gemini and make sure the saved
      // model actually belongs to it (older builds saved 'gpt-4o-mini').
      const s = this.store.settings();
      if (s.engine !== 'gemini' || !/^gemini/i.test(s.model)) {
        this.store.updateSettings({
          engine: 'gemini',
          model: /^gemini/i.test(s.model) ? s.model : 'gemini-2.5-flash',
        });
      }
      this.open.set(true);
      this.ui.setChatOpen(true);
      if (this.messages().length === 0) {
        this.pushAgent(
          this.remoteReady()
            ? '¡Hopp! 🦗 Agente de WorldHopp en línea con Gemini. Pregúntame lo que quieras: te guío por la web, busco ofertas y llevo tu candidatura de principio a fin.'
            : '¡Hopp! 🦗 Soy el agente de WorldHopp. Te guío por la página y resuelvo tus dudas. Conecta Gemini en ⚙️ para activar mi modo completo (ofertas, CV, emails, pagos).',
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

  onKeyInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.store.updateSettings({ apiKey: value });
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
    this.handleIntent(text);
  }

  runAction(action: ChatAction): void {
    if (action.intent === '__settings') {
      this.showSettings.set(true);
      this.pushAgent('Pega tu clave de Google AI Studio arriba (botón ⚙️) y vuelve a preguntarme: con ella funciono a tope. 🔑');
      return;
    }
    this.pushUser(action.label);
    this.handleIntent(action.intent);
  }

  private handleIntent(raw: string): void {
    const rule = this.resolveIntent(raw.toLowerCase());
    if (rule) {
      this.thinking.set(true);
      this.typingDelay = 350 + Math.random() * 450;
      this.typingTimer = setTimeout(() => {
        this.zone.run(() => {
          this.thinking.set(false);
          this.applyRule(rule);
        });
      }, this.typingDelay);
      return;
    }
    // No site rule: hand it to the agent engine (Gemini when configured).
    if (!this.remoteReady()) {
      this.pushAgent(
        'Para mi modo completo (buscar ofertas, generar CV y cartas, enviar emails y seguimientos, control de nóminas y pagos) conecta tu clave de Google AI Studio en ⚙️ — es gratuita. Mientras tanto te guío por la web. 🦗',
        [
          { label: '⚙️ Conectar Gemini', intent: '__settings' },
          { label: '🧭 Ver destinos', intent: 'destinos' },
        ]
      );
      return;
    }
    void this.askEngine(raw);
  }

  private async askEngine(raw: string): Promise<void> {
    const history = this.messages()
      .slice(-10)
      .map((m) => ({ role: m.from, text: m.text }));
    this.thinking.set(true);
    try {
      const reply = await this.engine.send(raw, history);
      this.zone.run(() => {
        this.thinking.set(false);
        for (const step of reply.steps) {
          this.store.log(step.tool, step.detail);
      }
        this.pushAgent(reply.text, undefined, reply.steps.length ? reply.steps : undefined);
      });
    } catch {
      this.zone.run(() => {
        this.thinking.set(false);
        this.pushAgent('He tenido un problema de red hablando con el modelo. Inténtalo de nuevo en un momento. ⚠️');
      });
    }
  }

  // ============ Site rules (instant, local) ============

  /** Returns a rule reply, or null to fall through to the agent engine. */
  private resolveIntent(raw: string): { text: string; actions?: ChatAction[]; scrollTarget?: string; navigate?: string } | null {
    const has = (...words: string[]): boolean => words.some((w) => raw.includes(w));

    if (has('barcelona', 'bcn', 'montju')) {
      return { text: 'BARCELONAhopp 🚡: academias top, mar y Montjuïc. Te abro su página.', navigate: '/destino/barcelona', actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }] };
    }
    if (has('malta', 'valeta', 'sliema')) {
      return { text: 'MALTAhopp 🇲🇹: inglés en el Mediterráneo, sol y playa. Abro su página.', navigate: '/destino/malta', actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }] };
    }
    if (has('irlanda', 'ireland', 'dublin', 'irish')) {
      return { text: 'IRELANDhopp 🇮🇪: inglés auténtico y trabajo desde el primer día. Te llevo a su página.', navigate: '/destino/irlanda', actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }] };
    }
    if (has('nueva zelanda', 'new zelanda', 'kiwi', 'nz')) {
      return { text: 'KIWIhopp 🇳🇿: el salto al otro lado del mundo, con trabajo incluido. Abro su página.', navigate: '/destino/nueva-zelanda', actions: [{ label: '🧭 Otros destinos', intent: 'destinos' }] };
    }
    if (has('contacto', 'contact', 'formulario', 'escribi', 'correo')) {
      return { text: 'Te dejo en el formulario de contacto. Rellena tus datos y el equipo os contesta en menos de 24h laborables. ✉️', scrollTarget: '#contact', actions: [{ label: '🧭 Ver destinos antes', intent: 'destinos' }] };
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
    if (has('equipo', 'team', 'quienes')) {
      return { text: 'Somos un equipo pequeño que ha vivido la experiencia en primera persona. Te presento a todos en la sección de equipo. 👋', scrollTarget: '#team', actions: [{ label: '✉️ Contactar', intent: 'contacto' }] };
    }
    if (has('servicio', 'service', 'ofrec', 'ayudáis', 'ayudais', 'hacéis', 'haceis')) {
      return { text: 'Os acompañamos en todo: elección de destino, matrícula, visado, alojamiento y trabajo. El «hopp» completo, de principio a fin. 🪃', scrollTarget: '#services' };
    }
    if (has('precio', 'coste', 'cuánto', 'cuanto', 'tarifa')) {
      return { text: 'Depende del destino y la duración. En el formulario podéis pedir un presupuesto sin compromiso y os enviamos el detalle. 💬', scrollTarget: '#contact' };
    }
    if (has('qué es', 'que es', 'cómo funciona', 'como funciona')) {
      return { text: 'WorldHopp acompaña a jóvenes que quieren estudiar y trabajar en el extranjero: eliges destino, nosotros nos ocupamos de papeleo, alojamiento y trámites. Tú solo da el hopp. 🦗', actions: [{ label: '🧭 Ver destinos', intent: 'destinos' }, { label: '🛠️ Ver servicios', intent: 'servicios' }] };
    }
    if (has('visa', 'visado')) {
      return { text: 'Gestionamos el visado working holiday y de estudiante según destino y edad. En la llamada inicial te decimos exactamente qué necesitas. 🛂', actions: [{ label: '✉️ Pedir llamada', intent: 'contacto' }] };
    }
    if (has('trabajo', 'job', 'empleo')) {
      return { text: 'Trabajáis mientras estudiáis: os orientamos con el buscón de empleo local y el CV en inglés. Muchos lo logran en las primeras semanas. 💪' };
    }
    if (has('inglés', 'ingles', 'english', 'idioma', 'nivel')) {
      return { text: 'No hace falta un nivel mínimo: hay cursos desde elemental. ¡Da igual por dónde empieces, lo importante es empezar! 🗣️', scrollTarget: '.hp-s8-learn-english' };
    }
    if (has('hola', 'buenas', 'hey', 'gracias', 'genial', 'perfecto')) {
      return { text: '¡Hola! 👋 ¿Qué te apetece ver? Puedo llevarte a destinos, servicios, equipo o contacto — o preguntarme lo que quieras si tienes Gemini conectado.', actions: this.quickActions };
    }
    return null;
  }

  private applyRule(rule: { text: string; actions?: ChatAction[]; scrollTarget?: string; navigate?: string }): void {
    if (rule.navigate) {
      this.close();
      this.router.navigateByUrl(rule.navigate);
      return;
    }
    if (rule.scrollTarget) {
      // Mobile: the sheet covers the page, so close it first and let the
      // user watch the scroll land on the section. History is kept.
      if (window.matchMedia('(max-width: 920px)').matches) {
        this.close();
      }
      this.scrollTo(rule.scrollTarget);
    }
    this.pushAgent(rule.text, rule.actions);
  }

  private scrollTo(target: string): void {
    this.zone.runOutsideAngular(() => scrollToTarget(target));
  }

  private pushUser(text: string): void {
    this.messages.update((m) => [...m, { from: 'user', text, time: this.time() }]);
    this.scrollBottom();
  }

  private pushAgent(text: string, actions?: ChatAction[], steps?: AgentStep[]): void {
    this.messages.update((m) => [...m, { from: 'agent', text, actions, steps, time: this.time() }]);
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
