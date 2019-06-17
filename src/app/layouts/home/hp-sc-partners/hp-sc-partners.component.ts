import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-partners',
  templateUrl: './hp-sc-partners.component.html',
  styleUrls: ['./hp-sc-partners.component.css']
})
export class HpScPartnersComponent implements OnInit {

  content = {
    slider: [
      {
        img: '../../../assets/img/partners/Lonely_Planet.svg.png',
        name: '',
        description: '',
        url: ''
      },
      {
        img: '../../../assets/img/partners/cdmon.png',
        name: '',
        description: '',
        url: ''
      },
      {
        img: '../../../assets/img/partners/wuxanos_logo.png',
        name: '',
        description: 'Los minions kawaii mas monis',
        url: 'http://wuxanos.com/'
      },
      {
        img: '../../../assets/img/partners/platzi_logo.png',
        name: '',
        description: '',
        url: ''
      },
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
