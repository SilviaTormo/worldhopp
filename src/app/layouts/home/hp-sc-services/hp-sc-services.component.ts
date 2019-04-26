import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-services',
  templateUrl: './hp-sc-services.component.html',
  styleUrls: ['./hp-sc-services.component.css']
})
export class HpScServicesComponent implements OnInit {

  content = {
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    title: '¿Qué te ofrecemos?',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Pellentesque luctus enim vel quam sagittis tristique.'
  };

  constructor() { }

  ngOnInit() {
  }

}
