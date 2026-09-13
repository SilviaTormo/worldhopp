import { Injectable, computed, effect, signal } from '@angular/core';
import {
  AgentDoc,
  AgentEmail,
  AgentLogEntry,
  AgentProfile,
  AgentSettings,
  Lead,
  LEAD_STAGES,
  LeadStage,
  Payment,
  Source,
} from './job-agent.types';

const KEY = 'worldhopp.job-agent.v1';

interface JobAgentState {
  profile: AgentProfile;
  sources: Source[];
  leads: Lead[];
  docs: AgentDoc[];
  emails: AgentEmail[];
  payments: Payment[];
  logs: AgentLogEntry[];
  settings: AgentSettings;
}

export const DEFAULT_PROFILE: AgentProfile = {
  name: 'Silvia',
  headline: 'Estudiante / Profesional en busca de experiencias en el extranjero',
  email: 'tu@email.com',
  phone: '',
  location: 'Madrid, España',
  languages: ['Español (nativo)', 'Inglés (B2)'],
  skills: ['Atención al cliente', 'Inglés', 'Trabajo en equipo', 'Ventas', 'Excel'],
  experience: [
    'Dependienta y atención al cliente (2 años)',
    'Prácticas de marketing digital (6 meses)',
  ],
  education: ['Grado en Administración y Dirección de Empresas'],
  qualifications: [
    { id: 'q1', title: 'Cambridge First (B2)', issuer: 'Cambridge', year: '2024' },
    { id: 'q2', title: 'Carné de manipulador de alimentos', year: '2023' },
  ],
  salaryMin: '1.800 €/mes',
  remoteOnly: false,
  targetCountries: ['Malta', 'Irlanda', 'España'],
};

const DEFAULT_SETTINGS: AgentSettings = {
  engine: 'mock',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  apiKey: '',
  temperature: 0.4,
};

/** Settings shown when the user switches engines in Ajustes. */
export const ENGINE_DEFAULTS: Record<AgentSettings['engine'], Pick<AgentSettings, 'baseUrl' | 'model'>> = {
  mock: { baseUrl: '', model: '' },
  'openai-compat': { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  gemini: { baseUrl: '', model: 'gemini-2.5-flash' },
};

/** Fixes stale combos persisted by older versions (e.g. Gemini engine carrying an OpenAI model name, which makes Google return 404). */
function normalizeSettings(s: AgentSettings): AgentSettings {
  if (s.engine === 'gemini' && !/^gemini/i.test(s.model)) {
    return { ...s, model: ENGINE_DEFAULTS.gemini.model };
  }
  return s;
}

const initial: JobAgentState = {
  profile: DEFAULT_PROFILE,
  sources: [
    { id: 's1', name: 'InfoJobs', query: 'site:infojobs.net "atención al cliente" Malta OR Irlanda', enabled: true, createdAt: new Date().toISOString() },
    { id: 's2', name: 'LinkedIn', query: 'site:linkedin.com/jobs junior English Malta', enabled: true, createdAt: new Date().toISOString() },
  ],
  leads: [],
  docs: [],
  emails: [],
  payments: [],
  logs: [],
  settings: DEFAULT_SETTINGS,
};

function load(): JobAgentState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<JobAgentState>;
    return {
      ...initial,
      ...parsed,
      profile: { ...initial.profile, ...parsed.profile },
      settings: normalizeSettings({ ...DEFAULT_SETTINGS, ...parsed.settings }),
      sources: parsed.sources ?? initial.sources,
      leads: parsed.leads ?? [],
      docs: parsed.docs ?? [],
      emails: parsed.emails ?? [],
      payments: parsed.payments ?? [],
      logs: parsed.logs ?? [],
    };
  } catch {
    return initial;
  }
}

@Injectable({ providedIn: 'root' })
export class JobAgentStore {
  private readonly state = signal<JobAgentState>(load());

  readonly profile = computed(() => this.state().profile);
  readonly sources = computed(() => this.state().sources);
  readonly leads = computed(() => this.state().leads);
  readonly docs = computed(() => this.state().docs);
  readonly emails = computed(() => this.state().emails);
  readonly payments = computed(() => this.state().payments);
  readonly logs = computed(() => this.state().logs);
  readonly settings = computed(() => this.state().settings);

  readonly activeLeads = computed(() => this.leads().filter((l) => !l.discarded));
  readonly board = computed(() => {
    const map = new Map<LeadStage, Lead[]>();
    for (const stage of LEAD_STAGES) map.set(stage, []);
    for (const lead of this.activeLeads()) map.get(lead.stage)!.push(lead);
    return map;
  });
  readonly incomeTotal = computed(() =>
    this.payments()
      .filter((p) => p.receivedAt)
      .reduce((sum, p) => sum + p.amount, 0)
  );
  readonly incomePending = computed(() =>
    this.payments()
      .filter((p) => !p.receivedAt)
      .reduce((sum, p) => sum + p.amount, 0)
  );

  constructor() {
    // Persist every change.
    effect(() => {
      const snapshot = JSON.stringify(this.state());
      try {
        localStorage.setItem(KEY, snapshot);
      } catch {
        /* quota — ignore */
      }
    });
  }

  private patch(partial: Partial<JobAgentState>): void {
    this.state.update((s) => ({ ...s, ...partial }));
  }

  log(tool: string, detail: string): void {
    const entry: AgentLogEntry = { id: crypto.randomUUID(), at: new Date().toISOString(), tool, detail };
    this.patch({ logs: [entry, ...this.state().logs].slice(0, 200) });
  }

  // ---- Profile ----
  updateProfile(p: Partial<AgentProfile>): void {
    this.patch({ profile: { ...this.state().profile, ...p } });
  }

  // ---- Settings ----
  updateSettings(s: Partial<AgentSettings>): void {
    this.patch({ settings: { ...this.state().settings, ...s } });
  }

  // ---- Sources ----
  addSource(name: string, query: string): Source {
    const src: Source = { id: crypto.randomUUID(), name, query, enabled: true, createdAt: new Date().toISOString() };
    this.patch({ sources: [...this.state().sources, src] });
    this.log('add_source', `Fuente añadida: ${name}`);
    return src;
  }
  toggleSource(id: string): void {
    this.patch({
      sources: this.state().sources.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    });
  }
  removeSource(id: string): void {
    this.patch({ sources: this.state().sources.filter((s) => s.id !== id) });
  }

  // ---- Leads ----
  addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const now = new Date().toISOString();
    const full: Lead = { ...lead, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    this.patch({ leads: [full, ...this.state().leads] });
    this.log('add_lead', `Oferta descubierta: ${full.title} @ ${full.company}`);
    return full;
  }
  moveLead(id: string, stage: LeadStage): void {
    this.patch({
      leads: this.state().leads.map((l) => (l.id === id ? { ...l, stage, updatedAt: new Date().toISOString() } : l)),
    });
  }
  discardLead(id: string, discarded = true): void {
    this.patch({
      leads: this.state().leads.map((l) => (l.id === id ? { ...l, discarded, updatedAt: new Date().toISOString() } : l)),
    });
  }

  // ---- Docs ----
  addDoc(doc: Omit<AgentDoc, 'id' | 'createdAt'>): AgentDoc {
    const full: AgentDoc = { ...doc, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.patch({ docs: [full, ...this.state().docs] });
    this.log('make_doc', `${full.kind.toUpperCase()} generado: ${full.title}`);
    return full;
  }
  markDocSent(id: string): void {
    this.patch({ docs: this.state().docs.map((d) => (d.id === id ? { ...d, sent: true } : d)) });
  }

  // ---- Emails ----
  addEmail(email: Omit<AgentEmail, 'id' | 'createdAt'>): AgentEmail {
    const full: AgentEmail = { ...email, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.patch({ emails: [full, ...this.state().emails] });
    this.log('send_email', `Correo (${full.status}) → ${full.to}`);
    return full;
  }
  setEmailStatus(id: string, status: AgentEmail['status']): void {
    this.patch({
      emails: this.state().emails.map((e) =>
        e.id === id ? { ...e, status, sentAt: status !== 'borrador' ? new Date().toISOString() : e.sentAt } : e
      ),
    });
  }

  // ---- Payments ----
  addPayment(payment: Omit<Payment, 'id'>): Payment {
    const full: Payment = { ...payment, id: crypto.randomUUID() };
    this.patch({ payments: [...this.state().payments, full] });
    this.log('add_payment', `Pago registrado: ${full.amount} ${full.currency} (${full.kind})`);
    return full;
  }
  markPaymentReceived(id: string): void {
    this.patch({
      payments: this.state().payments.map((p) =>
        p.id === id ? { ...p, receivedAt: new Date().toISOString() } : p
      ),
    });
    this.log('payment_received', `Cobro confirmado: ${id}`);
  }

  /** Demo seed so the board is not empty on first open. */
  seedDemo(): void {
    if (this.leads().length > 0) return;
    const now = new Date().toISOString();
    const mk = (n: number, title: string, company: string, stage: LeadStage, fit: number, source: string, salary?: string): Lead => ({
      id: 'demo-' + n,
      title,
      company,
      source,
      stage,
      fit,
      salary,
      createdAt: now,
      updatedAt: now,
      summary: 'Coincide con tu perfil y países objetivo.',
    });
    const leads = [
      mk(1, 'Customer Support (EN)', 'PlayaJobs Malta', 'descubierta', 82, 'InfoJobs', '1.700 €/mes'),
      mk(2, 'Recepcionista bilingüe', 'Hotel Sliema Group', 'evaluando', 76, 'LinkedIn', '1.900 €/mes'),
      mk(3, 'Sales Assistant', 'Dublin Retail Co.', 'cv-enviado', 88, 'LinkedIn', '2.100 €/mes'),
      mk(4, 'Community Manager', 'BCN Startup Lab', 'entrevista', 91, 'Manual', '2.000 €/mes'),
      mk(5, 'Office Admin (Spanish)', 'Kiwi Tours NZ', 'oferta', 84, 'Manual', 'NZ$3.200/mes'),
    ];
    this.patch({ leads: [...leads, ...this.state().leads] });
    this.log('seed', 'Demo cargada: 5 ofertas en el tablero');
  }
}
