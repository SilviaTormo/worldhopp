import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Rellax from 'rellax';

@Component({
  selector: 'app-hp-gallery-paralax',
  templateUrl: './hp-gallery-paralax.component.html',
  styleUrls: ['./hp-gallery-paralax.component.css']
})
export class HpGalleryParalaxComponent implements OnInit {

  @Input() gallery: Object[];
  rellaxClassName: String = '';

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    if (this.gallery['rellax'] != undefined && this.gallery['rellax']) {
      this.rellaxClassName = this.makeid();
      this.newRellax();
    }
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

  makeid() {
    const length = 5;
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if ((<HTMLElement>document.getElementsByClassName('rellax_' + text)[0])) {
      this.makeid();
    } else {
      return 'rellax_' + text;
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

}
