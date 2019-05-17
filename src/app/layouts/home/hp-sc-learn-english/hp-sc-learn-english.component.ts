import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hp-sc-learn-english',
  templateUrl: './hp-sc-learn-english.component.html',
  styleUrls: ['./hp-sc-learn-english.component.css']
})
export class HpScLearnEnglishComponent implements OnInit {

  content = {
    title: 'Aprende inglés mientras ves mundo',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Te ofrecemos los mejores cursos de inglés, tecnología, deportes, etc.. para estudiar en el extranjero. Worldhopp representa a las mejores instituciones en las ciudades principales.',
  };

  constructor() { }

  ngOnInit() {
  }

}
