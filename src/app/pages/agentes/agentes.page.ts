import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ENGINE_DEFAULTS, JobAgentStore } from '../../shared/job-agent/job-agent.store';
import { AgentSettings } from '../../shared/job-agent/job-agent.types';
import { AgentEngine, AgentStep } from '../../shared/job-agent/agent-engine';
import {
  AgentDoc,
  Lead,
  LeadStage,
  LEAD_STAGES,
  Payment,
  STAGE_LABEL,
} from '../../shared/job-agent/job-agent.types';

interface ChatMsg {
  from: 'user' | 'agent';
  text: string;
  steps?: AgentStep[];
  time: string;
}

type Tab = 'pipeline' | 'fuentes' | 'documentos' | 'correos' | 'pagos' | 'perfil' | 'ajustes';

/**
 * /agentes — agentic job-hunting workspace.
 * Chat with the agent (mock or OpenAI-compatible) on the left; on the right,
 * a scrum pipeline of offers from descubierta to cobro, plus tabs for
 * fuentes, documentos, correos, pagos, perfil and ajustes.
 */
@Component({
  selector: 'app-agentes-page',
  imports: [NgClass, DecimalPipe, DatePipe, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agentes.page.html',
  styleUrl: './agentes.page.css',
})
export class AgentesPageComponent {
  readonly store = inject(JobAgentStore);
  private engine = inject(AgentEngine);
  private cdr = inject(ChangeDetectorRef);

  readonly LEAD_STAGES = LEAD_STAGES;
  readonly STAGE_LABEL = STAGE_LABEL;

  readonly tab = signal<Tab>('pipeline');
  readonly messages = signal<ChatMsg[]>([]);
  readonly busy = signal(false);

  readonly stages = LEAD_STAGES;
  readonly board = computed(() => this.store.board());
  readonly engineLabel = computed(() => this.engine.engineLabel());

  readonly profile = computed(() => this.store.profile());
  readonly sources = computed(() => this.store.sources());
  readonly docs = computed(() => this.store.docs());
  readonly emails = computed(() => this.store.emails());
  readonly payments = computed(() => this.store.payments());

  readonly cobrado = computed(() => this.store.incomeTotal());
  readonly pendiente = computed(() => this.store.incomePending());

  @ViewChild('scroller') private scroller?: ElementRef<HTMLElement>;
  @ViewChild('chatInput') private chatInput?: ElementRef<HTMLTextAreaElement>;

  newSourceName = '';
  newSourceQuery = '';
  profileDraft = { ...this.store.profile() };

  constructor() {
    this.store.seedDemo();
    if (this.messages().length === 0) {
      this.messages.set([
        {
          from: 'agent',
          text:
            '¡Hopp! Soy tu agente de empleo. Busco ofertas en tus fuentes, genero CV y cartas, envío emails con seguimiento y llevo el control de nóminas y facturas hasta el cobro.\n\nPrueba: «busca ofertas» o «resumen del pipeline».',
          time: this.time(),
        },
      ]);
    }
  }

  // ---------- Chat ----------
  async sendMessage(): Promise<void> {
    const input = this.chatInput?.nativeElement;
    const text = input?.value.trim();
    if (!text || this.busy()) return;
    if (input) input.value = '';
    const history = this.messages().map((m) => ({ role: m.from, text: m.text }));
    this.messages.update((m) => [...m, { from: 'user', text, time: this.time() }]);
    this.busy.set(true);
    this.scrollBottom();
    try {
      const reply = await this.engine.send(text, history);
      this.messages.update((m) => [
        ...m,
        { from: 'agent', text: reply.text, steps: reply.steps, time: this.time() },
      ]);
    } finally {
      this.busy.set(false);
      this.cdr.detectChanges();
      this.scrollBottom();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.sendMessage();
    }
  }

  quick(prompt: string): void {
    if (this.chatInput) {
      this.chatInput.nativeElement.value = prompt;
    }
    void this.sendMessage();
  }

  private scrollBottom(): void {
    requestAnimationFrame(() => {
      const el = this.scroller?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  private time(): string {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  // ---------- Pipeline ----------
  leadsIn(stage: LeadStage): Lead[] {
    return this.board().get(stage) ?? [];
  }

  advance(lead: Lead): void {
    const i = LEAD_STAGES.indexOf(lead.stage);
    const next = LEAD_STAGES[Math.min(i + 1, LEAD_STAGES.length - 1)];
    this.store.moveLead(lead.id, next);
    this.store.log('move_lead', `Oferta movida a ${STAGE_LABEL[next]}: ${lead.title}`);
  }

  discard(lead: Lead): void {
    this.store.discardLead(lead.id);
  }

  onDragStart(event: DragEvent, lead: Lead): void {
    event.dataTransfer?.setData('text/lead-id', lead.id);
  }

  onDrop(event: DragEvent, stage: LeadStage): void {
    event.preventDefault();
    const id = event.dataTransfer?.getData('text/lead-id');
    if (!id) return;
    const lead = this.store.leads().find((l) => l.id === id);
    if (lead && lead.stage !== stage) {
      this.store.moveLead(id, stage);
      this.store.log('move_lead', `Oferta movida a ${STAGE_LABEL[stage]} (drag): ${lead.title}`);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // ---------- Profile helpers ----------
  splitList(value: string): string[] {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }

  splitLines(value: string): string[] {
    return value.split('\n').map((s) => s.trim()).filter(Boolean);
  }

  // ---------- Sources ----------
  addSource(): void {
    const name = this.newSourceName.trim();
    const query = this.newSourceQuery.trim();
    if (!name || !query) return;
    this.store.addSource(name, query);
    this.newSourceName = '';
    this.newSourceQuery = '';
  }

  // ---------- Docs ----------
  downloadDoc(doc: AgentDoc): void {
    const blob = new Blob([doc.body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title.replace(/[^\w\s-]/g, '') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Payments ----------
  confirmPayment(p: Payment): void {
    this.store.markPaymentReceived(p.id);
    const lead = this.store.leads().find((l) => l.id === p.leadId);
    if (lead && lead.stage === 'cobrando') {
      this.store.moveLead(lead.id, 'pagado');
    }
  }

  /** Switch engine in Ajustes and auto-fill its sensible defaults. */
  onEngineChange(value: string): void {
    const engine = value as AgentSettings['engine'];
    const defaults = ENGINE_DEFAULTS[engine];
    this.store.updateSettings({ engine, ...defaults });
  }

  setTab(t: Tab): void {
    this.tab.set(t);
  }
}
