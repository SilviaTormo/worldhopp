import { Component, OnInit, Input, AfterViewInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Rellax from 'rellax';

@Component({
  selector: 'app-hp-cards-paralax',
  templateUrl: './hp-cards-paralax.component.html',
  styleUrls: ['./hp-cards-paralax.component.css']
})
export class HpCardsParalaxComponent implements OnInit {

  @Input() cards: Object[] = [{
    icon: '../../../assets/img/icon_asesoria.PNG',
    title: 'Asesoria'
  }, {
    icon: '../../../assets/img/icon_oportunidades.PNG',
    title: 'Oportunidades para ti'
  }, {
    icon: '../../../assets/img/icon_informacion.PNG',
    title: 'Información en general'
  }];

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  setBgCard(url) {
    if (url !== '') {
      // safe value type URL
      url = this._sanitizer.bypassSecurityTrustUrl(url);
    }
    return url;
  }
}
