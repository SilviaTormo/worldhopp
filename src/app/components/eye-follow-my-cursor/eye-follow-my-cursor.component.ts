import { Component, OnInit, AfterContentInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-eye-follow-my-cursor',
  templateUrl: './eye-follow-my-cursor.component.html',
  styleUrls: ['./eye-follow-my-cursor.component.css']
})
export class EyeFollowMyCursorComponent implements OnInit, AfterContentInit {

  @ViewChild('eye') eyeChild: ElementRef;
  eyeChildProperties;
  eyeChildWidth = 0;
  eyeChildHeight = 0;

  @ViewChild('lids') lidsChild: ElementRef;
  @ViewChild('iris') irisChild: ElementRef;
  @ViewChild('pupil') pupilChild: ElementRef;

  lidMax = 76;
  skinColor = null;
  eyeColor;
  lidTop = {
    pos: 25,
    posGoal: 0,
    goalPos: 0,
    relaxed: 25,
    surprised: 10,
    angry: 70,
    playful: 10,
    bored: 55,
    tired: 70,
    squint: 60,
    lerp: 0,
    modifier: 1
  };
  lidBottom = {
    pos: 25,
    posGoal: 0,
    goalPos: 0,
    relaxed: 25,
    surprised: 10,
    angry: 30,
    playful: 50,
    bored: 15,
    tired: 55,
    squint: 65,
    lerp: 0,
    modifier: 1
  };
  iris = {
    ref: null,
    x: 0,
    y: 0,
    w: 60,
    h: 60,
    color: '',
    lerp: 0
  };
  pupil = {
    ref: null,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    size: 30,
    sizeGoal: 30,
    lerp: 0
  };
  blinkFlag = false;
  blinkTimer = 0;
  distractionTimer = 0;
  wakeTimer = this.getRandomNumber(240, 720);
  distractedFlag = true;
  mouse = {
    x: 50,
    y: 50,
    oldX: 50,
    oldY: 50
  };
  boredom = 0;
  shock = 0;
  anger = 0;

  r = this.iris.w / 2;
  center = {
    x: this.eyeChildWidth / 2 - this.r,
    y: this.eyeChildHeight / 2 - this.r
  };
  distanceThreshold = this.eyeChildWidth / 2 - this.r;
  xp = 45;
  yp = 55;

  constructor(
    private renderer2: Renderer2
  ) {
    this.lidTop.goalPos = this.lidTop.pos;
    this.lidBottom.goalPos = this.lidBottom.pos;
  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.eyeChildProperties = this.eyeChild.nativeElement.getBoundingClientRect();
    this.eyeChildWidth = this.eyeChildProperties.right - this.eyeChildProperties.left;
    this.eyeChildHeight = this.eyeChildProperties.bottom - this.eyeChildProperties.top;

    this.center = {
      x: this.eyeChildWidth / 2 - this.r,
      y: this.eyeChildHeight / 2 - this.r
    };

    this.distanceThreshold = this.eyeChildWidth / 2 - this.r;

    this.eyeColor = this.getValueStyles(this.eyeChild.nativeElement, 'background-color');
    this.eyeColor = this.eyeColor.replace(/[^\d,.]/g, '').split(',');
    // tslint:disable-next-line:radix
    this.eyeColor[0] = parseInt(this.eyeColor[0]);
    // tslint:disable-next-line:radix
    this.eyeColor[1] = parseInt(this.eyeColor[1]);
    // tslint:disable-next-line:radix
    this.eyeColor[2] = parseInt(this.eyeColor[2]);

    this.iris.ref = this.irisChild;
    // tslint:disable-next-line:radix
    this.iris.x = parseInt(this.getValueStyles(this.irisChild.nativeElement, 'left'));
    // tslint:disable-next-line:radix
    this.iris.y = parseInt(this.getValueStyles(this.irisChild.nativeElement, 'top'));
    // tslint:disable-next-line:radix
    this.iris.w = parseInt(this.getValueStyles(this.irisChild.nativeElement, 'width'));
    // tslint:disable-next-line:radix
    this.iris.h = parseInt(this.getValueStyles(this.irisChild.nativeElement, 'height'));
    this.iris.color = this.getValueStyles(this.irisChild.nativeElement, 'background-color');

    this.pupil.ref = this.pupilChild;
    // tslint:disable-next-line:radix
    this.pupil.x = parseInt(this.getValueStyles(this.pupilChild.nativeElement, 'left'));
    // tslint:disable-next-line:radix
    this.pupil.y = parseInt(this.getValueStyles(this.pupilChild.nativeElement, 'top'));
    // tslint:disable-next-line:radix
    this.pupil.w = parseInt(this.getValueStyles(this.pupilChild.nativeElement, 'width'));
    // tslint:disable-next-line:radix
    this.pupil.h = parseInt(this.getValueStyles(this.pupilChild.nativeElement, 'height'));

    this.skinColor = this.getValueStyles(this.lidsChild.nativeElement, 'border-top-color');

    // start main loop
    this.animate();
  }

  // Main animation/logic loop
  animate() {
    this.blinkTimer -= 1 + this.anger / 50;
    if (this.blinkTimer <= 0) {
      this.blinkTimer = this.getRandomNumber(120, 600);
      this.blinkFlag = true;
    }

    this.distractionTimer -= 1;

    if (this.distractionTimer <= 0) {
      this.distractionTimer = this.getRandomNumber(60, 120);

      if (this.distractedFlag === true) {
        // tslint:disable-next-line:radix
        const eyeposx = parseInt(this.getValueStyles(this.eyeChild.nativeElement, 'left'));
        // tslint:disable-next-line:radix
        const eyeposy = parseInt(this.getValueStyles(this.eyeChild.nativeElement, 'top'));
        const tempX = this.getRandomNumber((this.mouse.x + eyeposx + this.r) - 200, (this.mouse.x + eyeposx + this.r) + 200);
        const tempY = this.getRandomNumber((this.mouse.y + eyeposx + this.r) - 200, (this.mouse.y + eyeposx + this.r) + 100);

        const d = {
          x: tempX - this.r - eyeposx - this.center.x,
          y: tempY - this.r - eyeposy - this.center.y
        };

        const distance = Math.sqrt(d.x * d.x + d.y * d.y);
        if (distance < this.distanceThreshold) {
          this.mouse.x = tempX - eyeposx - this.r;
          this.mouse.y = tempY - eyeposy - this.r;
        } else {
          this.mouse.x = d.x / distance * this.distanceThreshold + this.center.x;
          this.mouse.y = d.y / distance * this.distanceThreshold + this.center.y;
        }
      }
      this.distractedFlag = true;
    }

    this.followMouse();
    this.updateEmotions();
    this.blink();
    this.updateEyeParts();
    this.mouse.oldX = this.mouse.x;
    this.mouse.oldY = this.mouse.y;

    setTimeout(() => {
      this.animate();
    }, 16);
  }

  updateEyeParts(): void {
    // ensure lids close/open properly
    if (this.lidTop.pos >= this.lidMax) {
      this.lidTop.pos = this.lidMax;
    } else if (this.lidTop.pos <= 0) {
      this.lidTop.pos = 0;
    }

    if (this.lidBottom.pos >= this.lidMax) {
      this.lidBottom.pos = this.lidMax;
    } else if (this.lidBottom.pos <= 0) {
      this.lidBottom.pos = 0;
    }

    // update eye "white" part
    const rgbString = 'rgb(' + Math.round(this.eyeColor[0]) + ',' + Math.round(this.eyeColor[1]) + ',' + Math.round(this.eyeColor[2]) + ')';
    this.setStyles(this.eyeChild.nativeElement, 'background-color', rgbString);

    // pupil focus
    this.pupil.size = this.interpolate(this.pupil.size, this.pupil.sizeGoal, this.pupil.lerp, 0.03);
    this.pupil.x = this.iris.w / 2 - this.pupil.size / 2;
    this.pupil.y = this.iris.h / 2 - this.pupil.size / 2;    // top lid
    this.setStyles(this.lidsChild.nativeElement, 'border-top', this.lidTop.pos + 'px solid ' + this.skinColor);

    // bottom lid
    this.setStyles(this.lidsChild.nativeElement, 'border-bottom', this.lidBottom.pos + 'px solid ' + this.skinColor);

    // iris/pupil movement and color
    this.setStyles(this.irisChild.nativeElement, 'left', this.iris.x + 'px');
    this.setStyles(this.irisChild.nativeElement, 'top', this.iris.y + 'px');
    this.setStyles(this.irisChild.nativeElement, 'background', this.iris.color);

    // pupil
    this.setStyles(this.pupilChild.nativeElement, 'left', this.pupil.x + 'px');
    this.setStyles(this.pupilChild.nativeElement, 'top', this.pupil.y + 'px');
    this.setStyles(this.pupilChild.nativeElement, 'width', this.pupil.size + 'px');
    this.setStyles(this.pupilChild.nativeElement, 'height', this.pupil.size + 'px');
  }

  /* note: does a bit too much, needs revising/refactoring.
  It's supposed to just do the blinking animation but it's
  starting to handle all of the eyelid animations.
*/
  blink(): void {
    if (this.blinkFlag) {
      this.lidTop.pos = this.interpolate(this.lidTop.pos, this.lidMax, this.lidTop.lerp, 0.6);
      this.lidBottom.pos = this.interpolate(this.lidBottom.pos, this.lidMax, this.lidBottom.lerp, 0.6);
    } else if (!this.blinkFlag) {
      if (this.anger >= 50) {
        this.lidTop.goalPos = this.lidTop.angry / this.lidTop.modifier;
        this.lidBottom.goalPos = this.lidBottom.angry / this.lidBottom.modifier;
      } else if (this.shock >= 50) {
        this.lidTop.goalPos = this.lidTop.surprised / this.lidTop.modifier;
        this.lidBottom.goalPos = this.lidBottom.surprised / this.lidBottom.modifier;
      } else if (this.boredom >= 150) {
        this.lidTop.goalPos = this.lidTop.goalPos + 1 / this.lidTop.modifier;
        this.lidBottom.goalPos = this.lidBottom.goalPos + 1 / this.lidBottom.modifier;
      } else if (this.boredom >= 50) {
        this.lidTop.goalPos = this.lidTop.bored / this.lidTop.modifier;
        this.lidBottom.goalPos = this.lidBottom.bored / this.lidBottom.modifier;
      } else {
        this.lidTop.goalPos = this.lidTop.relaxed / this.lidTop.modifier;
        this.lidBottom.goalPos = this.lidBottom.relaxed / this.lidBottom.modifier;
      }

      this.lidTop.pos = this.interpolate(this.lidTop.pos, this.lidTop.goalPos, this.lidTop.lerp, 0.3);
      this.lidBottom.pos = this.interpolate(this.lidBottom.pos, this.lidBottom.goalPos, this.lidBottom.lerp, 0.3);
    }

    if (this.lidTop.pos >= this.lidMax - 1 && this.lidBottom.pos >= this.lidMax - 1) {
      this.blinkFlag = false;
    }
  }

  updateEmotions(): void {
    this.boredom += 0.1;
    if (this.boredom >= 170) {
      this.boredom = 170;

      this.wakeTimer -= 1;
      if (this.wakeTimer <= 0) {
        this.wakeTimer = this.getRandomNumber(180, 720);
        this.boredom = 0;
      }
    } else if (this.boredom <= 0) {
      this.boredom = 0;
    }

    this.anger -= 0.15;
    if (this.anger >= 150) {
      this.anger = 150;
    } else if (this.anger <= 0) {
      this.anger = 0;
    }

    this.eyeColor[0] = this.interpolate(this.eyeColor[0], 245 + this.anger, 0, 0.008);
    this.eyeColor[1] = this.interpolate(this.eyeColor[1], 240 - this.anger, 0, 0.008);
    this.eyeColor[2] = this.interpolate(this.eyeColor[2], 240 - this.anger, 0, 0.008);
    this.eyeColor.forEach((element, index) => {
      if (this.eyeColor[index] >= 255) {
        this.eyeColor[index] = 255;
      } else if (this.eyeColor[index] <= 0) {
        this.eyeColor[index] = 0;
      }
    });
  }

  // move eye according to mouse movement
  followMouse(): void {
    const lerpSpeed = 0.12;
    this.xp = this.interpolate(this.xp, this.mouse.x, 0, lerpSpeed);
    this.yp = this.interpolate(this.yp, this.mouse.y, 0, lerpSpeed);

    // tslint:disable-next-line:max-line-length
    const distance = Math.sqrt((this.mouse.x - this.mouse.oldX) * (this.mouse.x - this.mouse.oldX) + (this.mouse.y - this.mouse.oldY) * (this.mouse.y - this.mouse.oldY));

    // simulate saccade eye movement
    if (distance >= 25) {
      this.xp = this.interpolate(this.xp, this.mouse.x, 0, 0.4);
      this.yp = this.interpolate(this.yp, this.mouse.y, 0, 0.4);
    }

    this.iris.x = this.xp;
    this.iris.y = this.yp;
  }

  // mouse movement event function
  @HostListener('window:mousemove', ['$event'])
  detectMoviment(e) {
    // console.log('Detected movement!');
    this.distractedFlag = false;

    // tslint:disable-next-line:radix
    const eyeposx = parseInt(this.getValueStyles(this.eyeChild.nativeElement, 'left'));
    // console.log('eyeposx', eyeposx);
    // tslint:disable-next-line:radix
    const eyeposy = parseInt(this.getValueStyles(this.eyeChild.nativeElement, 'top'));
    // console.log('eyeposy', eyeposy);

    const d = {
      x: e.pageX - this.r - eyeposx - this.center.x,
      y: e.pageY - this.r - eyeposy - this.center.y
    };

    console.log('d', d);

    const distance = Math.sqrt(d.x * d.x + d.y * d.y);
    console.log('distance', distance);
    if (distance < this.distanceThreshold) {
      this.mouse.x = e.pageX - eyeposx - this.r;
      this.mouse.y = e.pageY - eyeposy - this.r;
      console.log('(if)mousex', this.mouse.x);
      console.log('(if)mousey', this.mouse.y);
    } else {
      this.mouse.x = d.x / distance * this.distanceThreshold + this.center.x;
      this.mouse.y = d.y / distance * this.distanceThreshold + this.center.y;
      console.log('(else)mousex', this.mouse.x);
      console.log('(else)mousey', this.mouse.y);
    }

    // make eyelids close more the closer the mouse gets to them
    let lidModifier = (distance / 50);
    if (distance > 50) {
      lidModifier = 1;
    } else {
      // decrease blink interval if moving over eye
      this.blinkTimer -= 3;
    }

    if (lidModifier < 0.8) {
      lidModifier = 0.8;
    }

    this.lidTop.modifier = lidModifier;
    this.lidBottom.modifier = lidModifier;

    // pupil "focuses" the closer the mouse is
    if (distance < 100) {
      this.pupil.sizeGoal = lidModifier * 30;
    } else {
      this.pupil.sizeGoal = 30;
    }

    // decrease boredom because of mouse movement
    this.boredom -= 1;
  }

  // linearly interpolate from part to goalPos (smooth animation effect)
  interpolate(part, goalPos, currentLerp, lerpSpeed) {
    if (part !== goalPos) {
      currentLerp = 0;
    }

    if (currentLerp <= 1.0) {
      currentLerp += lerpSpeed;
    }

    part = this.lerp(part, currentLerp, goalPos);
    return part;
  }

  // actual formula for linear interpolation
  lerp(x, t, y) {
    return x * (1 - t) + y * t;
  }

  // get random integer in range min-max
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getValueStyles(element, style): any {
    return window.getComputedStyle(element, null).getPropertyValue(style).replace('px', '');
  }

  setStyles(element, style, value) {
    this.renderer2.setStyle(element, style, value);
  }

}
