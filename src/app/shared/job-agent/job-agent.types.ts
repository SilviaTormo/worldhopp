/**
 * Job-Hopp Agent — domain model.
 *
 * The agent hunts job offers ("leads") from user-configured sources, generates
 * application documents, sends emails + follow-ups and tracks payments
 * (nómina / factura) until completion. Everything persists to localStorage.
 */

export type LeadStage =
  | 'descubierta' // found by the agent
  | 'evaluando' // fit analysis done
  | 'cv-enviado' // CV + carta sent
  | 'entrevista'
  | 'oferta'
  | 'contrato' // contract signed, nómina/factura setup
  | 'cobrando' // money flowing
  | 'pagado'; // closed & paid

export const LEAD_STAGES: LeadStage[] = [
  'descubierta',
  'evaluando',
  'cv-enviado',
  'entrevista',
  'oferta',
  'contrato',
  'cobrando',
  'pagado',
];

export const STAGE_LABEL: Record<LeadStage, string> = {
  descubierta: 'Descubierta',
  evaluando: 'Evaluando',
  'cv-enviado': 'CV enviado',
  entrevista: 'Entrevista',
  oferta: 'Oferta',
  contrato: 'Contrato',
  cobrando: 'Cobrando',
  pagado: 'Pagado ✓',
};

/** Kind of income attached once the offer is signed. */
export type PaymentKind = 'nomina' | 'factura';

export interface Payment {
  id: string;
  leadId: string;
  kind: PaymentKind;
  /** Monthly amount (nómina) or invoice total (factura). */
  amount: number;
  currency: 'EUR' | 'USD' | 'GBP' | 'NZD';
  /** ISO date the money was received (empty = pending). */
  receivedAt?: string;
  /** ISO date it is expected. */
  expectedAt?: string;
  note?: string;
}

export interface Lead {
  id: string;
  title: string;
  company: string;
  source: string; // source id or manual label
  url?: string;
  location?: string;
  salary?: string;
  /** 0–100 fit against the user profile, computed by the agent. */
  fit: number;
  stage: LeadStage;
  createdAt: string;
  updatedAt: string;
  /** Short agent note about the match (why it fits / risks). */
  summary?: string;
  /** True once the user (or agent) rejects it — stays out of the board by default. */
  discarded?: boolean;
  paymentId?: string;
}

export interface Source {
  id: string;
  name: string;
  /** Where offers come from: a URL, an email query, an API endpoint… */
  query: string;
  enabled: boolean;
  createdAt: string;
}

export type DocKind = 'cv' | 'carta' | 'email';

export interface AgentDoc {
  id: string;
  leadId?: string;
  kind: DocKind;
  title: string;
  body: string;
  createdAt: string;
  sent?: boolean;
}

export type EmailStatus = 'borrador' | 'enviado' | 'abierto' | 'respondido' | 'seguimiento';

export interface AgentEmail {
  id: string;
  leadId?: string;
  to: string;
  subject: string;
  body: string;
  status: EmailStatus;
  createdAt: string;
  sentAt?: string;
  /** Follow-up number: 0 = original, 1+ = follow-ups. */
  followUpOf?: string;
}

export interface Qualification {
  id: string;
  title: string;
  issuer?: string;
  year?: string;
}

export interface AgentProfile {
  name: string;
  headline: string;
  email: string;
  phone?: string;
  location?: string;
  languages: string[];
  skills: string[];
  experience: string[];
  education: string[];
  qualifications: Qualification[];
  /** Constraints the agent must respect when filtering offers. */
  salaryMin?: string;
  remoteOnly?: boolean;
  targetCountries: string[];
}

export type EngineKind = 'mock' | 'openai-compat';

export interface AgentSettings {
  engine: EngineKind;
  baseUrl: string;
  model: string;
  /** Stored locally only; never leaves this browser except to the configured endpoint. */
  apiKey: string;
  temperature: number;
}

export interface AgentLogEntry {
  id: string;
  at: string;
  tool: string;
  detail: string;
}

/** A tool-call step the agent produced while answering. */
export interface ToolStep {
  id: string;
  tool: string;
  detail: string;
  ok: boolean;
}
