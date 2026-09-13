import { Injectable, signal } from '@angular/core';

/** Shared UI state between the floating ball and the agent chat panel. */
@Injectable({ providedIn: 'root' })
export class AgentUiService {
  /** True while the agent chat panel is open (the ball hides itself). */
  readonly chatOpen = signal(false);

  setChatOpen(open: boolean): void {
    this.chatOpen.set(open);
  }
}
