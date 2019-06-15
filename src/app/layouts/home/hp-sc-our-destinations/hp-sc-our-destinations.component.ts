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
          img: {
            path: '../../../assets/img/nz.jpg',
            text: 'New Zeland',
            textVisibility: 0,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#1684F5'
          },
          title: {
            text: 'KIWIhopp',
            textVisibility: 2,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#1684F5'
          },
          rellax: {
            speed: -1
          }
        },
        {
          img: {
            path: '../../../assets/img/malta.jpg',
            text: 'Malta',
            textVisibility: 0,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#F5A623'
          },
          title: {
            text: 'MALTAhopp',
            textVisibility: 2,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#F5A623'
          },
          rellax: {
            speed: 1
          }
        },
        {
          img: {
            path: '../../../assets/img/irlanda.jpg',
            text: 'Ireland',
            textVisibility: 0,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#1BBA99'
          },
          title: {
            text: 'IRELANDhopp',
            textVisibility: 2,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#1BBA99'
          },
          rellax: {
            speed: -1
          }
        },
        {
          img: {
            path: '../../../assets/img/bcn.jpg',
            text: 'Barcelona',
            textVisibility: 0,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#CA3D4E'
          },
          title: {
            text: 'BARCELONAhopp',
            textVisibility: 2,  // 0 (only mobile), 1 (only desktop), 2 (both device)
            color: '#CA3D4E'
          },
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
