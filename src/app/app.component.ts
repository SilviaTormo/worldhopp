import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  withoutUser = false;
  titles = {
    original: 'WorldHopp',
    leave: 'Hello?! We miss you 😥',
    toReturn: '👋 Hey there! Welcome back ...'
  };

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.missTheUser();
  }

  @HostListener('window:visibilitychange', [])
  missTheUser() {
    const newTitle = (document.hidden) ? this.titles.leave : (this.withoutUser) ? this.titles.toReturn : this.titles.original;

    if (document.hidden) {
      setTimeout(() => {
        this.setTitle(newTitle);
      }, 500);
      this.withoutUser = true;
    } else {
      setTimeout(() => {
        this.setTitle(newTitle);
      }, 400);
    }

    if (!document.hidden && this.withoutUser) {
      this.withoutUser = false;
      setTimeout(() => {
        this.missTheUser();
      }, 3000);
    }
  }

  setTitle(title) {
    this.titleService.setTitle(title);
  }

  getTitle() {
    return this.titleService.getTitle();
  }
}
