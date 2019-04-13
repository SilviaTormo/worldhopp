import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hp-btn-goto-contact',
  templateUrl: './hp-btn-goto-contact.component.html',
  styleUrls: ['./hp-btn-goto-contact.component.css']
})
export class HpBtnGotoContactComponent implements OnInit {

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

  hiddenBanner() {
    if (this.isMobile) {
      clearTimeout(this.timeOutHideBanner);
      this.hideBanner = true;
    }
  }

  showBanner() {
    if (this.isMobile) {
      this.timeOutHideBanner = setTimeout(() => {
        this.hideBanner = false;
      }, 1200);
    }
  }

}
