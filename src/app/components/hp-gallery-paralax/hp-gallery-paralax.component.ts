import { Component, OnInit, Input, AfterViewInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Rellax from 'rellax';

@Component({
  selector: 'app-hp-gallery-paralax',
  templateUrl: './hp-gallery-paralax.component.html',
  styleUrls: ['./hp-gallery-paralax.component.css']
})
export class HpGalleryParalaxComponent implements OnInit, AfterViewInit {

  @Input() images: Object[];

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const rellax = new Rellax('.rellax', {
      center: true
    });
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

}
