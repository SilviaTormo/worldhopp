import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu = [
    {
      name: 'Destinos',
      id: 'destinations',
      section: '.hp-s2-our-destinations'
    },
    {
      name: 'Servicios',
      id: 'services',
      section: '.hp-s4-services'
    },
    {
      name: 'Equipo',
      id: 'team',
      section: '.hp-s7-team'
    },
    {
      name: 'Contacto',
      id: 'contact',
      section: '.hp-s9-contact'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
