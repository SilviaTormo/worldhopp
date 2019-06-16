import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hp-sc-social',
  templateUrl: './hp-sc-social.component.html',
  styleUrls: ['./hp-sc-social.component.css']
})
export class HpScSocialComponent implements OnInit {

  content = {
    subtitle: 'Unete a la comunidad de WorldHoppers',
    title: 'Siguenos en Instagram para conocer las ultimas novedades de nuestros hábitats.',
    paragraph: ''
  };

  constructor() { }

  ngOnInit() {
  }

}
