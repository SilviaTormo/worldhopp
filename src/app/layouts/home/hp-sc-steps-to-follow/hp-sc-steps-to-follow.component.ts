import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-steps-to-follow',
  templateUrl: './hp-sc-steps-to-follow.component.html',
  styleUrls: ['./hp-sc-steps-to-follow.component.css']
})
export class HpScStepsToFollowComponent implements OnInit {

  content = {
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
  };

  constructor() { }

  ngOnInit() {
  }

}
