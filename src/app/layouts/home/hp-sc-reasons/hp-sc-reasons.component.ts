import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-reasons',
  templateUrl: './hp-sc-reasons.component.html',
  styleUrls: ['./hp-sc-reasons.component.css']
})
export class HpScReasonsComponent implements OnInit {

  content = {
    subtitle: 'La información que necesites para planificar tu viaje.',
    title: 'Te asesoramos con los tramites de las escuelas y los visados.',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Aprovecha las mejores oportunidades en cada destino gracias a las recomendaciones de nuestro equipo de coaching transformacional.'
  };

  // tslint:disable-next-line:no-inferrable-types
  showSideBar: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleShowSideBar() {
    this.showSideBar = !this.showSideBar;
  }

  handleActions(event) {
    switch (event.action) {
      case 'close':
        this.toggleShowSideBar();
        break;

      default:
        break;
    }
  }

}
