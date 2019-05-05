import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-services',
  templateUrl: './hp-sc-services.component.html',
  styleUrls: ['./hp-sc-services.component.css']
})
export class HpScServicesComponent implements OnInit {

  content = {
    subtitle: 'SERVICIOS, EVENTOS, PRACTICAS y MUCHO MAS',
    title: '¿Qué te ofrecemos?',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Los mejores programas de estudio a tu alcance en las ciudades de destino para que la experencia que elijas sea perfecta y adaptada a tus necesidades.'
  };

  constructor() { }

  ngOnInit() {
  }

}
