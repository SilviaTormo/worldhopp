import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sections = {
    'fates': {
      subtitle: 'Estas a un hopp de cambiar tu vida',
      title: 'Nuestros destinos',
      // tslint:disable-next-line:max-line-length
      paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.',
      images: [
        {
          img: '../../../assets/img/animals-1869759_1280.jpg',
          title: 'KIWIhopp',
          color: '#1684F5',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/scuba-diver-1049945_1280.jpg',
          title: 'MALTAhopp',
          color: '#F5A623',
          rellax: {
            speed: 1
          }
        },
        {
          img: '../../../assets/img/cliffs-of-moher-2641966_1280.jpg',
          title: 'IRELANDhopp',
          color: '#1BBA99',
          rellax: {
            speed: -1
          }
        },
        {
          img: '../../../assets/img/spain-1276209_1280.jpg',
          title: 'BARCELONAhopp',
          color: '#CA3D4E',
          rellax: {
            speed: 1
          }
        }
      ]
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
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
