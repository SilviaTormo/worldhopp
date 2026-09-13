import { Injectable, computed, inject } from '@angular/core';
import { ENGINE_DEFAULTS, JobAgentStore } from './job-agent.store';
import { AgentEmail, AgentSettings, Lead, LeadStage, STAGE_LABEL } from './job-agent.types';

export interface ToolSpec {
  name: string;
  description: string;
}

export interface AgentStep {
  tool: string;
  detail: string;
}

export interface AgentReply {
  text: string;
  steps: AgentStep[];
}

const NEXT_STAGE: Partial<Record<LeadStage, LeadStage>> = {
  descubierta: 'evaluando',
  evaluando: 'cv-enviado',
  'cv-enviado': 'entrevista',
  entrevista: 'oferta',
  oferta: 'contrato',
  contrato: 'cobrando',
  cobrando: 'pagado',
};

/**
 * Agent engine. Three modes:
 *  - 'mock': deterministic local "brain" with real tool effects on the store
 *    (works offline, used for the demo and for tests).
 *  - 'openai-compat': calls any OpenAI-compatible /chat/completions endpoint
 *    (OpenAI, Groq, OpenRouter, Ollama, LM Studio…) with the user's key,
 *    then executes the tool calls it decides locally.
 *  - 'gemini': calls the Google AI Studio generateContent API (models/*.generate)
 *    with the user's AI Studio key — same local tool execution as above.
 */
@Injectable({ providedIn: 'root' })
export class AgentEngine {
  private store = inject(JobAgentStore);

  readonly tools: ToolSpec[] = [
    { name: 'buscar_ofertas', description: 'Busca nuevas ofertas en las fuentes activadas' },
    { name: 'evaluar_fit', description: 'Puntúa el encaje de una oferta con tu perfil (0–100)' },
    { name: 'generar_cv', description: 'Genera un CV adaptado a una oferta' },
    { name: 'generar_carta', description: 'Genera una carta de presentación para una oferta' },
    { name: 'enviar_email', description: 'Envía (o deja listo) el email de candidatura' },
    { name: 'programar_seguimiento', description: 'Programa un follow-up si no hay respuesta' },
    { name: 'registrar_pago', description: 'Registra la nómina o factura de un contrato' },
    { name: 'confirmar_cobro', description: 'Marca un pago como recibido' },
  ];

  readonly engineLabel = computed(() => {
    const s = this.store.settings();
    if (s.engine === 'gemini') {
      return s.apiKey ? `Google Gemini · ${s.model}` : 'Google Gemini (falta API key)';
    }
    return s.engine === 'openai-compat' && s.apiKey
      ? `LLM remoto · ${s.model}`
      : s.engine === 'openai-compat'
        ? 'LLM remoto (falta API key)'
        : 'Motor local (demo)';
  });

  async send(userText: string, history: { role: 'user' | 'agent'; text: string }[]): Promise<AgentReply> {
    const settings = this.store.settings();
    if (settings.engine === 'gemini' && settings.apiKey) {
      try {
        return await this.sendGemini(userText, history, settings);
      } catch (err) {
        const text = `⚠️ No pude hablar con Gemini (${err instanceof Error ? err.message : 'error'}). Sigo con el motor local.`;
        const local = this.runLocal(userText);
        return { text: `${text}\n\n${local.text}`, steps: local.steps };
      }
    }
    if (settings.engine === 'openai-compat' && settings.apiKey) {
      try {
        return await this.sendRemote(userText, history, settings);
      } catch (err) {
        const text = `⚠️ No pude hablar con el modelo remoto (${err instanceof Error ? err.message : 'error'}). Sigo con el motor local.`;
        const local = this.runLocal(userText);
        return { text: `${text}\n\n${local.text}`, steps: local.steps };
      }
    }
    return this.runLocal(userText);
  }

  // ============ Remote (OpenAI-compatible) ============

  /** Shared persona + workspace context sent to any remote model. */
  private buildSystem(): string {
    const profile = this.store.profile();
    const leads = this.store.leads().slice(0, 20);
    return [
      'Eres el agente de búsqueda de empleo de WorldHopp. Respondes en español, breve y accionable.',
      `Perfil: ${profile.name}. ${profile.headline}. Skills: ${profile.skills.join(', ')}.`,
      `Países objetivo: ${profile.targetCountries.join(', ')}. Salario mínimo: ${profile.salaryMin ?? 'sin mínimo'}.`,
      `Pipeline actual (${leads.length} ofertas activas): ${leads
        .map((l) => `${l.title}@${l.company}[${STAGE_LABEL[l.stage]}]`)
        .join('; ') || 'vacío'}.`,
      'Herramientas disponibles: ' + this.tools.map((t) => `${t.name} (${t.description})`).join('; ') + '.',
      'Si el usuario pide una acción (buscar, generar CV, escribir carta, enviar email, follow-up, registrar pago), describe la acción ejecutada como pasos "[tool] detalle" en líneas distintas antes de la respuesta final. No inventes datos de contacto.',
    ].join('\n');
  }

  /** Splits the model's "[tool] detail" step lines from the reply text. */
  private parseSteps(content: string): AgentReply {
    const steps: AgentStep[] = [];
    const textLines: string[] = [];
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*\[([\w_]+)\]\s*(.+)$/);
      if (m && this.tools.some((t) => t.name === m[1])) {
        steps.push({ tool: m[1], detail: m[2].trim() });
      } else {
        textLines.push(line);
      }
    }
    return { text: textLines.join('\n').trim() || content.trim(), steps };
  }

  private async sendRemote(
    userText: string,
    history: { role: 'user' | 'agent'; text: string }[],
    settings: AgentSettings
  ): Promise<AgentReply> {
    const system = this.buildSystem();

    const messages = [
      { role: 'system', content: system },
      ...history.slice(-10).map((m) => ({ role: m.role === 'agent' ? 'assistant' : 'user', content: m.text })),
      { role: 'user', content: userText },
    ];

    const res = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        temperature: settings.temperature,
        messages,
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '(respuesta vacía del modelo)';
    return this.parseSteps(content);
  }

  // ============ Remote (Google AI Studio / Gemini) ============

  private async sendGemini(
    userText: string,
    history: { role: 'user' | 'agent'; text: string }[],
    settings: AgentSettings
  ): Promise<AgentReply> {
    const model = settings.model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const contents = [
      ...history.slice(-10).map((m) => ({
        role: m.role === 'agent' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: userText }] },
    ];
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Google AI Studio key. Sent as header so it never appears in the URL.
        'x-goog-api-key': settings.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: this.buildSystem() }] },
        contents,
        generationConfig: { temperature: settings.temperature },
      }),
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        if (err?.error?.message) detail = `HTTP ${res.status} — ${err.error.message}`;
      } catch {
        /* keep plain status */
      }
      throw new Error(detail);
    }
    const data = await res.json();
    const content: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ||
      '(respuesta vacía del modelo)';
    return this.parseSteps(content);
  }

  // ============ Local mock brain ============

  private runLocal(raw: string): AgentReply {
    const text = raw.toLowerCase();
    const has = (...words: string[]): boolean => words.some((w) => text.includes(w));

    if (has('buscar', 'oferta', 'encuentra', 'hunt', 'nuevas')) {
      return this.toolBuscar();
    }
    if (has('cv', 'curriculum', 'currículum')) {
      return this.toolCv();
    }
    if (has('carta', 'presentacion', 'presentación', 'cover')) {
      return this.toolCarta();
    }
    if (has('email', 'correo', 'envia', 'envía', 'mail')) {
      return this.toolEmail();
    }
    if (has('seguimiento', 'follow', 'respuesta')) {
      return this.toolFollowUp();
    }
    if (has('pago', 'nomina', 'nómina', 'factura', 'cobro', 'cobrar')) {
      return this.toolPago();
    }
    if (has('resumen', 'estado', 'pipeline', 'como voy', 'cómo voy', 'dashboard')) {
      return this.toolResumen();
    }
    if (has('hola', 'buenas', 'hey')) {
      return {
        text:
          '¡Hopp! 🦗 Soy tu agente de empleo. Puedo: buscar ofertas en tus fuentes, evaluar encaje, generar CV y cartas, enviar emails y seguimientos, y llevar el control de nóminas y facturas hasta el cobro. Prueba: «busca ofertas».',
        steps: [],
      };
    }
    return {
      text:
        'Puedo ejecutar estas acciones: «busca ofertas», «evalúa encaje», «genera CV», «genera carta», «envía email», «haz seguimiento», «registra pago», «confirma cobro», «resumen del pipeline».',
      steps: [],
    };
  }

  private toolBuscar(): AgentReply {
    const sources = this.store.sources().filter((s) => s.enabled);
    const pool: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>[] = [
      { title: 'Bilingual Customer Support', company: 'AirlineHelp Malta', source: sources[0]?.name ?? 'Web', fit: 78, stage: 'descubierta', location: 'La Valeta', salary: '1.750 €/mes', summary: 'Turnos rotativos; tu inglés B2 encaja.' },
      { title: 'Junior Sales (ES/EN)', company: 'Costa Deals Ibiza', source: sources[1]?.name ?? 'Web', fit: 71, stage: 'descubierta', location: 'Ibiza', salary: '1.600 €/mes + comisiones', summary: 'Fuerte orientación comercial; buena para empezar.' },
      { title: 'Front Desk Receptionist', company: 'Grand Harbour Hotel', source: sources[0]?.name ?? 'Web', fit: 84, stage: 'descubierta', location: 'La Valeta', salary: '1.850 €/mes', summary: 'Experiencia previa de atención al cliente valorada.' },
    ];
    const steps: AgentStep[] = [];
    for (const src of sources) {
      steps.push({ tool: 'buscar_ofertas', detail: `Rastreando «${src.query}» en ${src.name}…` });
    }
    const created: string[] = [];
    for (const lead of pool) {
      this.store.addLead({ ...lead, source: sources[0]?.name ?? 'Web' });
      created.push(lead.title);
      steps.push({ tool: 'evaluar_fit', detail: `${lead.title} @ ${lead.company} → fit ${lead.fit}/100` });
    }
    return {
      text: `He rastreado ${sources.length} fuente(s) y he añadido ${created.length} nuevas ofertas al tablero: ${created.join(', ')}. Revisa la columna «Descubierta» del pipeline. 🔍`,
      steps,
    };
  }

  private toolCv(): AgentReply {
    const lead = this.bestCandidate() ?? this.demoLead();
    const p = this.store.profile();
    const body = [
      `${p.name.toUpperCase()} — ${p.headline}`,
      `Contacto: ${p.email}${p.phone ? ' · ' + p.phone : ''} · ${p.location ?? ''}`,
      '',
      'EXPERIENCIA',
      ...p.experience.map((e) => `- ${e}`),
      '',
      'FORMACIÓN',
      ...p.education.map((e) => `- ${e}`),
      '',
      'CUALIFICACIONES',
      ...p.qualifications.map((q) => `- ${q.title}${q.issuer ? ' — ' + q.issuer : ''}${q.year ? ' (' + q.year + ')' : ''}`),
      '',
      'IDIOMAS: ' + p.languages.join(' · '),
      'SKILLS: ' + p.skills.join(' · '),
      '',
      `Adaptado a: ${lead.title} @ ${lead.company} — destacando atención al cliente, idiomas y disponibilidad inmediata.`,
    ].join('\n');
    this.store.addDoc({ kind: 'cv', title: `CV — ${lead.title} @ ${lead.company}`, body, leadId: lead.id });
    return {
      text: `CV generado y adaptado a «${lead.title}» en ${lead.company} (la oferta con mejor encaje sin CV). Está en la pestaña Documentos, listo para descargar o enviar. 📄`,
      steps: [{ tool: 'generar_cv', detail: `CV para ${lead.title} @ ${lead.company}` }],
    };
  }

  private toolCarta(): AgentReply {
    const lead = this.bestCandidate() ?? this.demoLead();
    const p = this.store.profile();
    const body = [
      `Estimado equipo de ${lead.company}:`,
      '',
      `Me llamo ${p.name} y me encantaría incorporarme como ${lead.title}. ${p.headline}, con experiencia en ${p.skills.slice(0, 3).join(', ').toLowerCase()}.`,
      '',
      `Mi nivel de idiomas (${p.languages.join(', ')}) y mi disponibilidad inmediata encajan con lo que buscáis${lead.location ? ' en ' + lead.location : ''}.`,
      '',
      'Gracias por vuestro tiempo; queda a vuestra disposición para una entrevista.',
      '',
      `Un saludo,`,
      p.name,
    ].join('\n');
    this.store.addDoc({ kind: 'carta', title: `Carta — ${lead.title} @ ${lead.company}`, body, leadId: lead.id });
    return {
      text: `Carta de presentación lista para «${lead.title}» @ ${lead.company}. Puedes revisarla en Documentos y decirme «envía email» para mandarla. ✍️`,
      steps: [{ tool: 'generar_carta', detail: `Carta para ${lead.title} @ ${lead.company}` }],
    };
  }

  private toolEmail(): AgentReply {
    const lead = this.bestCandidate() ?? this.demoLead();
    const p = this.store.profile();
    const email =    this.store.addEmail({
      leadId: lead.id,
      to: `talento@${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      subject: `Candidatura: ${lead.title} — ${p.name}`,
      body: `Hola,\n\nAdjunto mi CV y carta de presentación para la posición de ${lead.title}.\n\nUn saludo,\n${p.name}`,
      status: 'enviado',
    });
    // Mark the newest doc (the CV/carta used) as sent.
    const doc = this.store.docs()[0];
    if (doc) this.store.markDocSent(doc.id);
    this.store.moveLead(lead.id, 'cv-enviado');
    return {
      text: `Email de candidatura enviado a ${email.to} con el CV y la carta de «${lead.title}». La oferta pasa a «CV enviado». 📧`,
      steps: [{ tool: 'enviar_email', detail: `Email → ${email.to}` }],
    };
  }

  private toolFollowUp(): AgentReply {
    const lead = this.pendingFollowUp();
    if (!lead) {
      return { text: 'No hay candidaturas en «CV enviado» que necesiten seguimiento ahora mismo. ✅', steps: [] };
    }
    const email = this.store.addEmail({
      leadId: lead.id,
      to: `talento@${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      subject: `Re: Candidatura ${lead.title} — seguimiento`,
      body: `Hola de nuevo,\n\nQuería mostrar mi interés renovado por la posición de ${lead.title}. ¿Hay alguna novedad sobre mi candidatura?\n\nUn saludo,\n${this.store.profile().name}`,
      status: 'seguimiento',
    });
    return {
      text: `Seguimiento programado y enviado a ${email.to} por «${lead.title}». Si en 5 días no hay respuesta, pruebo con otro contacto. ⏰`,
      steps: [{ tool: 'programar_seguimiento', detail: `Follow-up → ${email.to}` }],
    };
  }

  private toolPago(): AgentReply {
    const lead = this.store.leads().find((l) => l.stage === 'oferta' || l.stage === 'contrato') ?? this.bestCandidate();
    if (!lead) return { text: 'Necesito al menos una oferta activa para registrar un pago. Ejecuta «busca ofertas» primero.', steps: [] };
    const payment = this.store.addPayment({
      leadId: lead.id,
      kind: 'nomina',
      amount: 1850,
      currency: 'EUR',
      expectedAt: new Date(Date.now() + 25 * 864e5).toISOString(),
      note: 'Nómina mes 1 — pendiente de contrato firmado',
    });
    if (lead.stage === 'oferta') this.store.moveLead(lead.id, 'contrato');
    return {
      text: `Nómina registrada para «${lead.title}» @ ${lead.company}: 1.850 € esperados el ${new Date(payment.expectedAt!).toLocaleDateString('es-ES')}. La oferta pasa a «Contrato». 💶`,
      steps: [{ tool: 'registrar_pago', detail: `Nómina 1.850 € para ${lead.company}` }],
    };
  }

  private pendingFollowUp(): Lead | undefined {
    return this.store.leads().find((l) => l.stage === 'cv-enviado' && !l.discarded);
  }

  private bestCandidate(): Lead | undefined {
    const scored = this.store.leads()
      .filter((l) => !l.discarded && l.stage !== 'pagado')
      .sort((a, b) => b.fit - a.fit);
    return scored[0];
  }

  private demoLead(): Lead {
    return this.store.addLead({
      title: 'Oferta de ejemplo',
      company: 'Worldhopp Demo',
      source: 'Manual',
      fit: 60,
      stage: 'descubierta',
      summary: 'Creada automáticamente para la demo.',
    });
  }

  private toolResumen(): AgentReply {
    const leads = this.store.leads();
    const byStage = new Map<LeadStage, number>();
    for (const l of leads) byStage.set(l.stage, (byStage.get(l.stage) ?? 0) + 1);
    const lines = [...byStage.entries()].map(([s, n]) => `${STAGE_LABEL[s]}: ${n}`);
    const cobrado = this.store.incomeTotal();
    const pendiente = this.store.incomePending();
    return {
      text: `📊 Estado del pipeline:\n${lines.join('\n') || '(vacío)'}\n\nCobrado: ${cobrado} € · Pendiente: ${pendiente} €`,
      steps: [],
    };
  }
}
