import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-experiences',
  templateUrl: './hp-sc-experiences.component.html',
  styleUrls: ['./hp-sc-experiences.component.css']
})
export class HpScExperiencesComponent implements OnInit {

  content = {
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
  };

  constructor() { }

  ngOnInit() {
  }

}
