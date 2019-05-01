import { Component, OnInit, Input, SecurityContext, ViewChild, AfterContentChecked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Rellax from 'rellax';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-hp-gallery-paralax',
  templateUrl: './hp-gallery-paralax.component.html',
  styleUrls: ['./hp-gallery-paralax.component.css']
})
export class HpGalleryParalaxComponent implements OnInit, AfterContentChecked {

  @Input() gallery: Object[];
  @ViewChild('galleryElement') galleryElement;
  rellaxClassName: String = '';
  sliderClassName: String = '';

  // tslint:disable-next-line:no-inferrable-types
  isMobile: boolean = false;

  // tslint:disable-next-line:no-inferrable-types
  currentSlider: number = 0;
  // tslint:disable-next-line:no-inferrable-types
  sliderWidth: number = 800;

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.checkWindowWidth();

    if (this.gallery['rellax'] != undefined && this.gallery['rellax']) {
      this.rellaxClassName = this.makeid('g-rellax');
      this.newRellax();
    }

    this.sliderClassName = this.makeid('g-slider');
    this.newSlider();
  }

  ngAfterContentChecked(): void {
    this.getSliderWidth();
  }

  getFormat(text) {
    if (/^[\w]+hopp$/.test(text)) {
      return text.replace(/^([\w]+)hopp$/, '$1') + '<span class="hopp-name">hopp</span>';
    } else {
      return text;
    }
  }

  setBgImage(url) {
    if (url !== '') {
      // safe value type URL
      url = this._sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
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

  newRellax() {
    if ((<HTMLElement>document.getElementsByClassName('' + this.rellaxClassName)[0])) {
      const rellax = new Rellax('.' + this.rellaxClassName, {
        center: true
      });
    } else {
      setTimeout(() => {
        this.newRellax();
      }, 100);
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
          if (this.currentSlider !== (this.gallery['images'].length - 1)) {
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
    const element = this.galleryElement.nativeElement.getBoundingClientRect();
    const widthSize = element.width;
    const marginSize = 10;
    const realWidthSize = (marginSize + widthSize);
    // console.log(realWidthSize);
    this.sliderWidth = realWidthSize;
  }

  checkWindowWidth() {
    const windowWidth = window.innerWidth;
    if (windowWidth > 920) {
      this.isMobile = false;
      this.currentSlider = 0;
    } else {
      this.isMobile = true;
    }
  }

}
