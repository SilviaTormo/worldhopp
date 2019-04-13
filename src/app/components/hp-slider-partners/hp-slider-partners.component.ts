import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-hp-slider-partners',
  templateUrl: './hp-slider-partners.component.html',
  styleUrls: ['./hp-slider-partners.component.css']
})
export class HpSliderPartnersComponent implements OnInit {

  @Input() sliderList: Object[] = [];
  // tslint:disable-next-line:no-inferrable-types
  @Input() dots: boolean = false;

  // tslint:disable-next-line:no-inferrable-types
  currentSlider: number = 0;
  sliderClassName: String = '';

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.sliderClassName = this.makeid();
    this.newSlider();
  }

  setBgImage(url) {
    if (url !== '') {
      // safe value type URL
      url = this._sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
    }
    return url;
  }

  makeid() {
    const length = 5;
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if ((<HTMLElement>document.getElementsByClassName('slider_' + text)[0])) {
      this.makeid();
    } else {
      return 'slider_' + text;
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
        console.log('Swipe Left!');
        this.currentSlider = (this.currentSlider === (this.sliderList.length - 1)) ? 0 : ++this.currentSlider;
      });
      mc.on('swiperight', () => {
        console.log('Swipe Right!');
        this.currentSlider = (this.currentSlider === 0) ? (this.sliderList.length - 1) : --this.currentSlider;
      });
    } else {
      setTimeout(() => {
        this.newSlider();
      }, 100);
    }
  }
}
