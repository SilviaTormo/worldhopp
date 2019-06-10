import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-steps-to-follow',
  templateUrl: './hp-sc-steps-to-follow.component.html',
  styleUrls: ['./hp-sc-steps-to-follow.component.css']
})
export class HpScStepsToFollowComponent implements OnInit {

  content = {
    // subtitle: 'No necesitas saber inglés, nosotros nos ocupamos de todo.',
    subtitle: 'nosotros nos ocupamos de todo.',
    title: 'Pasos a seguir',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Nuestro Hopper te informará y te ayudará a elegir. Además te matriculará y te asistirá con el Visado y todos los trámites de formalización. Realiza los preparativos, compra los vuelos y preguntanos las dudas de última hora. Te recibimos y damos los primeros pasos contigo. ',
    gallery: {
      steps: true,
      rellax: true,
      images: [
        {
          img: '../../../assets/img/decide.jpg',
          text: 'Infórmate y Decide',
          fontWeight: '600',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/city-1868530_1280.jpg',
          text: 'Conviertete en Worldhopper',
          fontWeight: '600',
          rellax: {
            speed: 1
          }
        },
        {
          img: '../../../assets/img/maletas.jpg',
          text: 'Haz las maletas',
          fontWeight: '600',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/welcome.jpg',
          text: 'Welcome to the Jungle!',
          fontWeight: '600',
          rellax: {
            speed: 1
          }
        }
      ]
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
