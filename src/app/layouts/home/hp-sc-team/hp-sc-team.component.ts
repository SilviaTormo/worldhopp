import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-team',
  templateUrl: './hp-sc-team.component.html',
  styleUrls: ['./hp-sc-team.component.css']
})
export class HpScTeamComponent implements OnInit {

  content = {
    subtitle: 'Un equipo entero a tu disposición',
    title: 'Nuestro equipo',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Te asesoramos gratuitamente sobre vuelos, seguros, preparativos para el viaje y resolvemos todas las dudas que tengas. Tu Hopper está allí y te lo cuenta todo, el también pasó por ello!',
    gallery: {
      steps: false,
      rellax: true,
      images: [
        {
          img: {
            path: '../../../assets/img/natalia.jpg',
          },
          rellax: {
            speed: -1
          }
        },
        {
          img: {
            path: '../../../assets/img/silvia.jpg',
          },
          rellax: {
            speed: 1
          }
        },
        {
          img: {
            path: '../../../assets/img/tania.jpg',
          },
          rellax: {
            speed: -1
          }
        }
      ]
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
