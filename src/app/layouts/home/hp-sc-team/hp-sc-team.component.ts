import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-team',
  templateUrl: './hp-sc-team.component.html',
  styleUrls: ['./hp-sc-team.component.css']
})
export class HpScTeamComponent implements OnInit {

  content = {
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: 'Nuestro equipo',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Asesoramos sobre los vuelos, seguros y preparativos para el viaje... y resolvemos las dudas hasta el ultimo momento.',
    gallery: {
      steps: false,
      rellax: true,
      images: [
        {
          img: '../../../assets/img/woman-1149911_1280.jpg',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/guy-598180_1280.jpg',
          rellax: {
            speed: 1
          }
        },
        {
          img: '../../../assets/img/beautiful-1274056_1280.jpg',
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
