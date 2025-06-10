import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-hp-sc-contact',
  templateUrl: './hp-sc-contact.component.html',
  styleUrls: ['./hp-sc-contact.component.css']
})
export class HpScContactComponent implements OnInit {

  content = {
    title: '¿Quieres dar el Hopp?',
    paragraph: 'Contáctanos! Te contestaremos cuanto antes.',
  };

  nationalitiesAvailable = [
    'España',
    'Chile',
    'Brasil'
  ];

  /* Stars Variables */
  maxStars = 40;
  curStars = 0;
  starLifeTime = 6000; // time in ms
  @ViewChild('starCanvas') starCanvas: ElementRef;
  starCanvasPropierties = {
    element: undefined,
    width: undefined,
    height: undefined
  };
  availableStarColors = {
    colors: [
      'green',
      'blue',
      'yellow'
    ],
    length: undefined
  };
  starStored = [];

  constructor(
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    if (this.maxStars > 0) {
      this.starCanvasPropierties.element = this.starCanvas.nativeElement.getBoundingClientRect();
      this.starCanvasPropierties.width = this.starCanvasPropierties.element.width;
      this.starCanvasPropierties.height = this.starCanvasPropierties.element.height;
      this.availableStarColors.length = this.availableStarColors.colors.length;
      this.generateStars();
    }
  }

  generateStars() {
    const newStar = this.setStar();
    // tslint:disable-next-line:max-line-length
    const elemnt = this.renderer2.createElement('div');
    this.renderer2.setAttribute(elemnt, 'class', 'star star-' + newStar.color);
    this.renderer2.setStyle(elemnt, 'width', newStar.size + 'px');
    this.renderer2.setStyle(elemnt, 'height', newStar.size + 'px');
    this.renderer2.setStyle(elemnt, 'top', newStar.pos.y + 'px');
    this.renderer2.setStyle(elemnt, 'left', newStar.pos.x + 'px');
    this.starStored.push(elemnt);
    this.renderer2.appendChild(this.starCanvas.nativeElement, elemnt);
    this.curStars++;
    setTimeout(() => {
      this.removeStars();
    }, 6000);
    if (this.curStars < this.maxStars) {
      this.generateStars();
    }
  }

  removeStars() {
    const starSelected = this.getRandomNumberBetweenTwoNumbers(0, this.starStored.length);
    this.renderer2.addClass(this.starCanvas.nativeElement.getElementsByClassName('star')[starSelected], 'star-dying');
    setTimeout(() => {
      if (this.starCanvas.nativeElement.getElementsByClassName('star')[starSelected].classList.contains('star-dying')) {
        this.renderer2.removeChild(this.starCanvas.nativeElement, this.starStored[starSelected]);
        this.starStored.splice(starSelected, 1);
        this.generateStars();
      }
    }, this.starLifeTime);
  }

  setStar() {
    const newStar = {
      size: this.getRandomNumberBetweenTwoNumbers(4, 10),
      color: this.availableStarColors.colors[this.getRandomNumberBetweenTwoNumbers(0, this.availableStarColors.length)],
      pos: {
        x: this.getRandomNumberBetweenTwoNumbers(0, this.starCanvasPropierties.width),
        y: this.getRandomNumberBetweenTwoNumbers(0, this.starCanvasPropierties.height)
      }
    };
    return newStar;
  }

  getRandomNumberBetweenTwoNumbers(min, max) {
    if (min > max) {
      return;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
