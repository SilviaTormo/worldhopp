import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-reasons',
  templateUrl: './hp-sc-reasons.component.html',
  styleUrls: ['./hp-sc-reasons.component.css']
})
export class HpScReasonsComponent implements OnInit {

  content = {
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: 'In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus.',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.'
  };

  // tslint:disable-next-line:no-inferrable-types
  showSideBar: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleShowSideBar() {
    this.showSideBar = !this.showSideBar;
  }

  handleActions(event) {
    switch (event.action) {
      case 'close':
        this.toggleShowSideBar();
        break;

      default:
        break;
    }
  }

}
