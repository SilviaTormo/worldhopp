import { Component, OnInit, Input, ViewChild, AfterContentChecked, Renderer2, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-hp-slider-experiences',
  templateUrl: './hp-slider-experiences.component.html',
  styleUrls: ['./hp-slider-experiences.component.css']
})
export class HpSliderExperiencesComponent implements OnInit, AfterContentChecked {

  @Input() sliderList: Object[] = [];

  // tslint:disable-next-line:no-inferrable-types
  currentSlider: number = 0;
  sliderClassName: String = '';
  // tslint:disable-next-line:no-inferrable-types
  sliderWidth: number = 800;
  sliderTimer;

  @ViewChild('eSliderList') eSliderList: ElementRef;

  constructor(
    private _sanitizer: DomSanitizer,
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    this.sliderClassName = this.makeid();
    this.newSlider();
  }

  ngAfterContentChecked(): void {
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
      // const Swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL });
      const Pan = new Hammer.Pan({ threshold: 0, direction: Hammer.DIRECTION_HORIZONTAL });
      // Swipe.recognizeWith(Pan);
      // mc.add(Swipe);
      mc.add(Pan);
      mc.on('pan', (e) => {
        const percentage = (this.sliderList.length * 100) / this.sliderList.length * e.deltaX / this.sliderWidth;
        const percentageCalculated = percentage - (this.sliderList.length * 100) / this.sliderList.length * this.currentSlider;
        this.renderer2.setStyle(this.eSliderList.nativeElement, 'transform', 'translateX( ' + percentageCalculated + '% )');

        if (e.isFinal) {
          if (e.velocityX > 1) {
            this.goTo(this.currentSlider - 1);
          } else if (e.velocityX < -1) {
            this.goTo(this.currentSlider + 1);
          } else {
            if (percentage <= -(100 / this.sliderList.length)) {
              this.goTo(this.currentSlider + 1);
            } else if (percentage >= (100 / this.sliderList.length)) {
              this.goTo(this.currentSlider - 1);
            } else {
              this.goTo(this.currentSlider);
            }
          }
        }
      });
    } else {
      setTimeout(() => {
        this.newSlider();
      }, 100);
    }
  }

  goTo(number) {
    if (number < 0) {
      this.currentSlider = 0;
    } else if (number > (this.sliderList.length - 1)) {
      this.currentSlider = this.sliderList.length - 1;
    } else {
      this.currentSlider = number;
    }
    this.renderer2.addClass(this.eSliderList.nativeElement, 'is-animating');
    const percentage = -((this.sliderList.length * 100) / this.sliderList.length) * this.currentSlider;
    this.renderer2.setStyle(this.eSliderList.nativeElement, 'transform', 'translateX( ' + percentage + '% )');
    clearTimeout(this.sliderTimer);
    const self = this;
    this.sliderTimer = setTimeout(function () {
      self.renderer2.removeClass(self.eSliderList.nativeElement, 'is-animating');
    }, 400);
  }

  getSliderWidth() {
    const element = this.eSliderList.nativeElement.getBoundingClientRect();
    const widthSize = element.width;
    const marginSize = 20;
    const realWidthSize = (marginSize + widthSize);
    // console.log(marginSize);
    this.sliderWidth = realWidthSize;
  }
}
