import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hp-text-container',
  templateUrl: './hp-text-container.component.html',
  styleUrls: ['./hp-text-container.component.css']
})
export class HpTextContainerComponent implements OnInit {

  @Input() subtitle: string = null;
  @Input() title: string = null;
  @Input() paragraph: string = null;

  constructor() { }

  ngOnInit() {
  }

}
