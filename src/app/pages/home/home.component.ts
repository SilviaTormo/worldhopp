import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

<<<<<<< HEAD
  sections = {
    'fates': {
      subtitle: 'Estas a un hopp de cambiar tu vida',
      title: 'Nuestros destinos',
      // tslint:disable-next-line:max-line-length
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.',
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
    },
    'reasons': {
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      title: 'In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus.',
      // tslint:disable-next-line:max-line-length
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.'
    },
    'services': {
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      title: '¿Qué te ofrecemos?',
      // tslint:disable-next-line:max-line-length
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.'
    },
    'stepsToFollow': {
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      title: 'Pasos a seguir',
      // tslint:disable-next-line:max-line-length
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.',
      gallery: {
        steps: true,
        rellax: true,
        images: [
          {
            img: '../../../assets/img/alone-480474_1280.jpg',
            text: 'Lorem ipsum dolor',
            fontWeight: '600',
            rellax: {
              speed: -1
            }
          },
          {
            img: '../../../assets/img/city-1868530_1280.jpg',
            text: 'Lorem ipsum dolor',
            fontWeight: '600',
            rellax: {
              speed: 1
            }
          },
          {
            img: '../../../assets/img/airport-2373727_1280.jpg',
            text: 'Lorem ipsum dolor',
            fontWeight: '600',
            rellax: {
              speed: -1
            }
          },
          {
            img: '../../../assets/img/spain-1276209_1280.jpg',
            text: 'Lorem ipsum dolor',
            fontWeight: '600',
            rellax: {
              speed: 1
            }
          }
        ]
      }
    },
    'experiences': {
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      title: 'Otros ya lo han hecho!',
      // tslint:disable-next-line:max-line-length
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.',
      slider: [
        {
          photo: '../../../assets/img/water-1245677_1280.jpg',
          user: '',
          // tslint:disable-next-line:max-line-length
          comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.'
        },
        {
          photo: '../../../assets/img/girls-1209321_1280.jpg',
          user: '',
          // tslint:disable-next-line:max-line-length
          comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.'
        },
        {
          photo: '../../../assets/img/men-2425121_1280.jpg',
          user: '',
          // tslint:disable-next-line:max-line-length
          comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.'
        }
      ]
    },
    'team': {
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
            img: 'https://www.kiwihopp.com/wp-content/uploads/2018/04/Natalia.jpg',
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
    },
    'learnEnglish': {
      title: 'Aprende inglés mientras ves mundo',
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dictum vel nisl quis dignissim.',
    },
    'contact': {
      title: '¿Quieres dar el hopp?',
      paragraph: 'Lorem ipsum dolor sit amet, consectetur.',
    },
    'partners': {
      slider: [
        {
          img: '../../../assets/img/partners/Lonely_Planet.svg.png',
          name: '',
          description: '',
          url: ''
        },
        {
          img: '../../../assets/img/partners/Lonely_Planet.svg.png',
          name: '',
          description: '',
          url: ''
        },
        {
          img: '../../../assets/img/partners/Lonely_Planet.svg.png',
          name: '',
          description: '',
          url: ''
        },
        {
          img: '../../../assets/img/partners/Lonely_Planet.svg.png',
          name: '',
          description: '',
          url: ''
        },
      ]
=======
  menu = [
    {
      name: 'Destinos',
      id: 'destinations',
      section: '.hp-s2-our-destinations'
    },
    {
      name: 'Servicios',
      id: 'services',
      section: '.hp-s4-services'
    },
    {
      name: 'Equipo',
      id: 'team',
      section: '.hp-s7-team'
    },
    {
      name: 'Contacto',
      id: 'contact',
      section: '.hp-s9-contact'
>>>>>>> master
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
