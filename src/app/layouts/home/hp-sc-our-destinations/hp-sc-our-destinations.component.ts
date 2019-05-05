import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-our-destinations',
  templateUrl: './hp-sc-our-destinations.component.html',
  styleUrls: ['./hp-sc-our-destinations.component.css']
})
export class HpScOurDestinationsComponent implements OnInit {

  content = {
    subtitle: 'Estas a un hopp de cambiar tu vida',
    title: 'Nuestros destinos',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Lánzate a una aventura épica en nuestros hábitats. Tu sueño de viajar y estudiar convertido en una experiencia que será inolvidable. Lets Hopp together!',
    gallery: {
      steps: false,
      rellax: true,
      images: [
        {
          img: '../../../assets/img/animals-1869759_1280.jpg',
          text: 'KIWIhopp',
          color: '#1684F5',
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/scuba-diver-1049945_1280.jpg',
          text: 'MALTAhopp',
          color: '#F5A623',
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center',
          rellax: {
            speed: 1
          }
        },
        {
          img: '../../../assets/img/cliffs-of-moher-2641966_1280.jpg',
          text: 'IRELANDhopp',
          color: '#1BBA99',
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/spain-1276209_1280.jpg',
          text: 'BARCELONAhopp',
          color: '#CA3D4E',
          fontSize: '22px',
          fontWeight: '600',
          textAlign: 'center',
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
