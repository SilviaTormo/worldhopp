import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { TweenMax } from 'gsap';
import * as ScrollMagic from 'ScrollMagic';
import 'ScrollMagic/scrollmagic/minified/plugins/debug.addIndicators.min.js';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:no-inferrable-types
  scrollIsUp: boolean = true;
  controller = new ScrollMagic.Controller();

  @Input() anchors = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.anchors.length > 0) {
      this.toogleClass();
    }
  }

  printLogo(num, total) {
    return num === (total / 2);
  }

  handleScroll() {
    const scrollYPos = window.scrollY;

    if (scrollYPos > 10) {
      this.scrollIsUp = false;
    } else {
      this.scrollIsUp = true;
    }
  }

  toogleClass() {
    this.anchors.forEach((anchor) => {
      if (document.querySelector(anchor.section)) {
        const scene = new ScrollMagic.Scene({
          triggerElement: anchor.section,
          duration: document.querySelector(anchor.section).getBoundingClientRect().height
        });
        scene.setClassToggle('#link-' + anchor.id, 'active');
        // scene.addIndicators();
        scene.addTo(this.controller);
      } else {
        setTimeout(() => {
          this.toogleClass();
        }, 200);
      }
    });
  }

  goTo(sectionId) {
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  }

}
