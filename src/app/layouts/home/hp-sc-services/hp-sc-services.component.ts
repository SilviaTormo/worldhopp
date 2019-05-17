import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-services',
  templateUrl: './hp-sc-services.component.html',
  styleUrls: ['./hp-sc-services.component.css']
})
export class HpScServicesComponent implements OnInit {

  content = {
<<<<<<< HEAD
    subtitle: 'SERVICIOS, EVENTOS, PRACTICAS y MUCHO MAS',
    title: '¿Qué te ofrecemos?',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Los mejores programas de estudio a tu alcance en las ciudades de destino para que la experencia que elijas sea perfecta y adaptada a tus necesidades.'
=======
    subtitle: 'PROGRAMAS DE ESTUDIOS, GUIAS, DESCUENTOS y MUCHO MAS',
    title: '¿Qué te ofrecemos?',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Una experiencia completa. Con los mejores programas de estudio en el extranjero adaptados a tus necesidades. Te asesoramos con los trámites y los visados para que no tengas que preocuparte de nada.'
>>>>>>> sandra2
  };

  constructor() { }

  ngOnInit() {
  }

}
