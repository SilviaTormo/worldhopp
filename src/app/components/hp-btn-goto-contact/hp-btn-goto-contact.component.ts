import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-hp-btn-goto-contact',
  templateUrl: './hp-btn-goto-contact.component.html',
  styleUrls: ['./hp-btn-goto-contact.component.css']
})
export class HpBtnGotoContactComponent implements OnInit {

  @Input() anchor = '';

  // tslint:disable-next-line:no-inferrable-types
  isMobile: boolean = false;

  // tslint:disable-next-line:no-inferrable-types
  hideBanner: boolean = false;

  timeOutHideBanner = null;

  constructor() { }

  ngOnInit() {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    const windowWidth = window.innerWidth;
    if (windowWidth > 960) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  getScrollPosition(): number {
    const scrollY = document.documentElement.scrollTop + document.documentElement.clientHeight;
    const scrollYHeight = document.documentElement.scrollHeight;
    const percentageScroll = ((scrollY / scrollYHeight) * 100).toFixed(0);
    return Number(percentageScroll);
  }

  hiddenBanner() {
    if (this.isMobile && this.getScrollPosition() < 100) {
      clearTimeout(this.timeOutHideBanner);
      this.hideBanner = true;
    }
  }

  showBanner() {
    if (this.isMobile) {
      if (this.getScrollPosition() < 100) {
        this.timeOutHideBanner = setTimeout(() => {
          this.hideBanner = false;
        }, 1200);
      } else {
        this.hideBanner = false;
      }
    }
  }

  goToContactForm() {
    document.querySelector('.hp-s9-contact').scrollIntoView({ behavior: 'smooth' });
  }

}
