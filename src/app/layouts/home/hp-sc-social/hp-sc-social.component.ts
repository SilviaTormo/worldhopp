import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hp-sc-social',
  templateUrl: './hp-sc-social.component.html',
  styleUrls: ['./hp-sc-social.component.css']
})
export class HpScSocialComponent implements OnInit {

  content = {
    subtitle: 'Unete a la comunidad de WorldHoppers',
    title: 'Es tu turno, el mundo está a tu alcance',
    paragraph: 'Explora nuestras redes y comparte con nosotros tu aventura.'
  };

  constructor() { }

  ngOnInit() {
  }

}
