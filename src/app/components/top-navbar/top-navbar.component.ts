import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  scrollIsUp: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  handleScroll() {
    const scrollYPos = window.scrollY;

    if (scrollYPos > 10) {
      this.scrollIsUp = false;
    } else {
      this.scrollIsUp = true;
    }
  }

}
