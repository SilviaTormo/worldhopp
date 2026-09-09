import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hp-text-container',
  imports: [NgClass],
  templateUrl: './hp-text-container.component.html',
  styleUrl: './hp-text-container.component.css',
})
export class HpTextContainerComponent {
  @Input() theme: 'dark' | 'light' = 'dark';
  @Input() subtitle: string | null = null;
  @Input() title: string | null = null;
  @Input() title2: string | null = null;
  @Input() paragraph: string | null = null;
}
