import { Component, OnInit, Input, ViewChild, AfterContentInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-hp-slider-experiences',
  templateUrl: './hp-slider-experiences.component.html',
  styleUrls: ['./hp-slider-experiences.component.css']
})
export class HpSliderExperiencesComponent implements OnInit, AfterContentInit {

  @Input() sliderList: Object[] = [];

  // tslint:disable-next-line:no-inferrable-types
  currentSlider: number = 1;
  sliderClassName: String = '';
  // tslint:disable-next-line:no-inferrable-types
  sliderWidth: number = 800;

  @ViewChild('eSliderList') eSliderList;

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.sliderClassName = this.makeid();
    this.newSlider();
  }

  ngAfterContentInit(): void {
    this.getSliderWidth();
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
        // console.log('Swipe Left!');
        this.currentSlider = (this.currentSlider === (this.sliderList.length - 1)) ? 0 : ++this.currentSlider;
      });
      mc.on('swiperight', () => {
        // console.log('Swipe Right!');
        this.currentSlider = (this.currentSlider === 0) ? (this.sliderList.length - 1) : --this.currentSlider;
      });
    } else {
      setTimeout(() => {
        this.newSlider();
      }, 100);
    }
  }

  getSliderWidth() {
    const element = this.eSliderList.nativeElement.getBoundingClientRect();
    const widthSize = element.width;
    const marginSize = 20;
    const realWidthSize = (marginSize + widthSize);
    console.log(marginSize);
    this.sliderWidth = realWidthSize;
  }
}
