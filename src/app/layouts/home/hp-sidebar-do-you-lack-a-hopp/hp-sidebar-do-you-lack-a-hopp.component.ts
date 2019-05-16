import { Component, OnInit, OnDestroy, EventEmitter, Output, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hp-sidebar-do-you-lack-a-hopp',
  templateUrl: './hp-sidebar-do-you-lack-a-hopp.component.html',
  styleUrls: ['./hp-sidebar-do-you-lack-a-hopp.component.css']
})
export class HpSidebarDoYouLackAHoppComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-inferrable-types
  hideSideBar: boolean = false;

  cards = [
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Verás mundo',
      text: 'Conocerás diferentes formas de vivir, pensar y explorarás nuevos sitios que jamás habías imaginado.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Entenderás otras culturas',
      // tslint:disable-next-line:max-line-length
      text: 'Ya que vivir en otro país, significa conocer a sus habitantes, relacionarte y sumergirte en sus costumbres y su estilo de vida. Entenderás verdaderamente sus pensamientos y formas de vivir.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Verás tu país desde fuera',
      // tslint:disable-next-line:max-line-length
      text: 'Y aunque te parezca raro, te darás cuenta de que tu propio país tiene cosas estupendas y que hay otras que podrían mejorarse bastante. Serás mucho mas objetivo.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Amigos para toda la vida',
      // tslint:disable-next-line:max-line-length
      text: 'Conocerás gente de todas partes del mundo, compartirás experiencias inolvidables, momentos difíciles y horas de charlas, y seréis amigos para siempre por que al cruzar vuestros caminos todo fue diferente. Además a partir de este momento, seguro que ya no tienes excusas para ir a visitar a tus nuevos amigos en sus países, crearás una red de amistades internacional.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Romperás con tu rutina',
      // tslint:disable-next-line:max-line-length
      text: 'Romperás tanto con tu rutina que será como una segunda vida, una oportunidad de hacer las cosas diferentes. Tendás tiempo para ti y para hacer lo que más te guste, ¡reinvéntate!'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'El placer de hablar otro idioma',
      // tslint:disable-next-line:max-line-length
      text: 'Porque cuando al principio la comunicación se hace más compleja, con los días adquirirás más fluidez, vocabulario y sobre todo confianza y seguridad en ti mismo, y empezarás a entender las canciones que has cantado toda tu vida en plan wachu wachu!'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Viajas',
      // tslint:disable-next-line:max-line-length
      text: 'Te animarás a hacer muchísimas salidas entre semana y escapadas de fin de semana, puentes, vacaciones, estarás muy activo porque vas a querer aprovechar al máximo esta experiencia y tu memoria se llenará de momentos inolvidables.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Mejorarás tu CV y tus oportunidades laborales',
      // tslint:disable-next-line:max-line-length
      text: 'Porque tu perspectiva será más amplia, tu experiencia será diferente, confiaras mas en ti mismo y los cursos que realices darán a tu hoja de vida un valor mas agregado.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: 'Enriquecerás tu vida!',
      text: 'E inspirarás a la gente que te rodea; a tus amigos, hermanos, familia a perseguir sus sueños y dar el salto.'
    },
    {
      image: '../../../../assets/img/wave-1913559_1280.jpg',
      title: '¡Serás feliz!',
      // tslint:disable-next-line:max-line-length
      text: 'Y cuando cierres la etapa y mires para atrás, sabrás que fue lo correcto porque fue lo que querías hacer, con sus momentos duros y sus momentos de risas.'
    }
  ];

  @ViewChild('sbHeader') sbHeader: ElementRef;
  @ViewChild('sbHeaderTitle') sbHeaderTitle: ElementRef;

  @Output() private actionToExport = new EventEmitter();

  constructor(
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    this.renderer2.setStyle(document.documentElement, 'overflow', 'hidden');
  }

  ngOnDestroy(): void {
    this.renderer2.removeStyle(document.documentElement, 'overflow');
  }

  scrollEffects(event) {
    const sidebarHeaderHeight = this.sbHeader.nativeElement.getBoundingClientRect().height;
    const scrollPos = event.target.scrollTop;
    let calcPercent = (scrollPos / (sidebarHeaderHeight / 2.5));
    if (calcPercent > 1) {
      calcPercent = 1;
    }
    const percentScroll = (((scrollPos / sidebarHeaderHeight) * 100) > 50) ? 50 : ((scrollPos / sidebarHeaderHeight) * 100);
    const getValue = (percentScroll * 200) / sidebarHeaderHeight;
    this.sbHeaderTitle.nativeElement.style.opacity = 1 - calcPercent;
    this.sbHeaderTitle.nativeElement.style.marginBottom = '-' + getValue + 'px';
  }

  closeSideBar() {
    this.hideSideBar = true;
    // this.renderer2.removeStyle(document.body, 'overflow');

    setTimeout(() => {
      this.exportAction('close');
    }, 400);
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  exportAction(actionName, data = {}) {
    this.actionToExport.emit({
      action: actionName,
      data: data
    });
  }

}
