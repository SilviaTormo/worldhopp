import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-contact',
  templateUrl: './hp-sc-contact.component.html',
  styleUrls: ['./hp-sc-contact.component.css']
})
export class HpScContactComponent implements OnInit {

  content = {
    title: '¿Quieres dar el Hopp?',
    paragraph: 'Contáctanos! Te contestaremos cuanto antes.',
  };

  nationalitiesAvailable = [
    'España',
    'Chile',
    'Brasil'
  ];

  constructor() { }

  ngOnInit() {
  }

}
