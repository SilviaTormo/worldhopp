import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'WorldHopp';

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.missTheUser();
  }

  @HostListener('window:visibilitychange', [])
  missTheUser() {
    const newTitle = (document.hidden) ? 'Hello! We miss you 😥' : this.title;
    if (document.hidden) {
      setTimeout(() => {
        this.setTitle(newTitle);
      }, 500);
    } else {
      this.setTitle(newTitle);
    }
  }

  setTitle(title) {
    this.titleService.setTitle(title);
  }

  getTitle() {
    return this.titleService.getTitle();
  }
}
