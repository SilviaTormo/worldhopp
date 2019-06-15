import { Component, OnInit, Input, SecurityContext, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Rellax from 'rellax';

@Component({
  selector: 'app-hp-cards-paralax',
  templateUrl: './hp-cards-paralax.component.html',
  styleUrls: ['./hp-cards-paralax.component.css']
})
export class HpCardsParalaxComponent implements OnInit, AfterViewInit {

  @ViewChild('cardsElement') cardsElement: ElementRef;

  @Input() cards: Object[] = [{
    icon: '../../../assets/img/icon_asesoria.PNG',
    title: 'Asesoria gratis y trámites online'
  }, {
    icon: '../../../assets/img/icon_oportunidades.PNG',
    title: 'Oportunidades para tí'
  }, {
    icon: '../../../assets/img/icon_informacion.PNG',
    title: 'Información durante la experiencia'
  }];

  // tslint:disable-next-line:no-inferrable-types
  sliderClassName: string = '';

  // tslint:disable-next-line:no-inferrable-types
  isMobile: boolean = false;

  // tslint:disable-next-line:no-inferrable-types
  currentSlider: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  sliderWidth: number = 208;

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.checkWindowWidth();

    this.sliderClassName = this.makeid('g-slider');
    this.newSlider();
  }

  ngAfterViewInit(): void {
    this.getSliderWidth();
  }

  setBgCard(url) {
    if (url !== '') {
      // safe value type URL
      url = this._sanitizer.bypassSecurityTrustUrl(url);
    }
    return url;
  }

  makeid(className) {
    const length = 5;
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if ((<HTMLElement>document.getElementsByClassName(className + '_' + text)[0])) {
      this.makeid(className);
    } else {
      return className + '_' + text;
    }
  }

  newSlider() {
    if ((<HTMLElement>document.getElementsByClassName('' + this.sliderClassName)[0])) {
      const slider = (<HTMLElement>document.getElementsByClassName('' + this.sliderClassName)[0]);
      const mc = new Hammer.Manager(slider);
      const Swipe = new Hammer.Swipe({
        direction: Hammer.DIRECTION_HORIZONTAL
      });
      mc.add(Swipe);
      mc.on('swipeleft', () => {
        if (this.isMobile) {
          if (this.currentSlider !== (this.cards.length - 1)) {
            // console.log('Swipe Left!');
            this.currentSlider = ++this.currentSlider;
          }
        }
      });
      mc.on('swiperight', () => {
        if (this.isMobile) {
          if (this.currentSlider !== 0) {
            // console.log('Swipe Right!');
            this.currentSlider = --this.currentSlider;
          }
        }
      });
    } else {
      setTimeout(() => {
        this.newSlider();
      }, 100);
    }
  }

  getSliderWidth() {
    if (this.cards.length > 0) {
      // tslint:disable-next-line:max-line-length
      if ((<HTMLElement>document.getElementsByClassName(this.sliderClassName)[0]) && (<HTMLElement>document.getElementsByClassName(this.sliderClassName)[0]).getElementsByClassName('cb-card-box')[this.currentSlider]) {
        // tslint:disable-next-line:max-line-length
        const element = (<HTMLElement>document.getElementsByClassName(this.sliderClassName)[0]).getElementsByClassName('cb-card-box')[this.currentSlider].getBoundingClientRect();
        const widthSize = element.width;
        const marginSize = 10;
        const realWidthSize = (marginSize + widthSize);
        // console.log(realWidthSize);
        this.sliderWidth = realWidthSize;
      }
    }
  }

  checkWindowWidth() {
    const windowWidth = window.innerWidth;
    if (windowWidth > 750) {
      this.isMobile = false;
      this.currentSlider = 0;
    } else {
      this.isMobile = true;
    }
  }
}
