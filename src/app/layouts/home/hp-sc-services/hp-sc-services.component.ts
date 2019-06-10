import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-services',
  templateUrl: './hp-sc-services.component.html',
  styleUrls: ['./hp-sc-services.component.css']
})
export class HpScServicesComponent implements OnInit {

  content = {
    // subtitle: 'PROGRAMAS DE ESTUDIOS, GUIAS, DESCUENTOS y MUCHO MAS',
    subtitle: 'PROGRAMAS DE ESTUDIOS, GUIAS, DESCUENTOS y MAS',
    title: '¿Qué te ofrecemos?',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Una experiencia completa. Con los mejores programas de estudio en el extranjero adaptados a tus necesidades. Te asesoramos con los trámites y los visados para que no tengas que preocuparte de nada.'
  };

  constructor() { }

  ngOnInit() {
  }

}
