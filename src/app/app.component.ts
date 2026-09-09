import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent implements OnInit, OnDestroy {
  private titleService = inject(Title);

  private withoutUser = false;
  private timers: ReturnType<typeof setTimeout>[] = [];

  private readonly titles = {
    original: 'WorldHopp',
    leave: 'Hello?! We miss you 😥',
    toReturn: '👋 Hey there! Welcome back ...',
  };

  ngOnInit(): void {
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.timers.forEach(clearTimeout);
  }

  private onVisibilityChange = (): void => {
    this.timers.forEach(clearTimeout);
    this.timers = [];

    if (document.hidden) {
      this.timers.push(setTimeout(() => this.titleService.setTitle(this.titles.leave), 500));
      this.withoutUser = true;
    } else {
      this.timers.push(
        setTimeout(
          () => this.titleService.setTitle(this.withoutUser ? this.titles.toReturn : this.titles.original),
          400
        )
      );
    }
  };
}
