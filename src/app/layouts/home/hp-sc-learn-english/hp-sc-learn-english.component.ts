import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-learn-english',
  templateUrl: './hp-sc-learn-english.component.html',
  styleUrls: ['./hp-sc-learn-english.component.css']
})
export class HpScLearnEnglishComponent implements OnInit {

  content = {
    title: 'Aprende inglés mientras ves mundo',
    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dictum vel nisl quis dignissim.',
  };

  constructor() { }

  ngOnInit() {
  }

}
