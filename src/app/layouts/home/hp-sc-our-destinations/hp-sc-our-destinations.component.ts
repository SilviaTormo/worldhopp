import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-our-destinations',
  templateUrl: './hp-sc-our-destinations.component.html',
  styleUrls: ['./hp-sc-our-destinations.component.css']
})
export class HpScOurDestinationsComponent implements OnInit {

  content = {
    subtitle: 'Estas a un Hopp de cambiar tu vida',
    title: 'Nuestros destinos',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Lánzate a una aventura única en nuestros hábitats. Tu sueño de viajar y estudiar convertido en una experiencia que será inolvidable. Lets Hopp Together!',
    gallery: {
      steps: false,
      rellax: true,
      images: [
        {
          img: '../../../assets/img/nz.jpg',
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
          img: '../../../assets/img/malta.jpg',
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
          img: '../../../assets/img/irlanda.jpg',
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
          img: '../../../assets/img/bcn.jpg',
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
