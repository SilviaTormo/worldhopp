import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpSidebarDoYouLackAHoppComponent } from '../hp-sidebar-do-you-lack-a-hopp/hp-sidebar-do-you-lack-a-hopp.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { SidebarCard } from '../hp-sidebar-do-you-lack-a-hopp/hp-sidebar-do-you-lack-a-hopp.component';

@Component({
  selector: 'app-hp-sc-reasons',
  imports: [HpTextContainerComponent, HpSidebarDoYouLackAHoppComponent, RevealDirective],
  templateUrl: './hp-sc-reasons.component.html',
  styleUrl: './hp-sc-reasons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScReasonsComponent {
  content = {
    title: 'La información que necesites para planificar tu viaje.',
    subtitle: 'Never alone. Vamos contigo!',
    paragraph:
      'Te acompañamos en todas las etapas de tu aventura, nosotros ya hemos vivido todas las experiencias. Bienvenido a la comunidad de Worldhoppers.',
  };

  showSideBar = false;

  sidebarCards: SidebarCard[] = [
    {
      image: 'img/mundo.jpg',
      title: 'Verás mundo',
      text: 'Conocerás diferentes formas de vivir, pensar y explorarás nuevos sitios que jamás habías imaginado.',
    },
    {
      image: 'img/cultura.jpg',
      title: 'Entenderás otras culturas',
      text: 'Ya que vivir en otro país, significa conocer a sus habitantes, relacionarte y sumergirte en sus costumbres y su estilo de vida. Entenderás verdaderamente sus pensamientos y formas de vivir.',
    },
    {
      image: 'img/paisdesdefuera.jpg',
      title: 'Verás tu país desde fuera',
      text: 'Y aunque te parezca raro, te darás cuenta de que tu propio país tiene cosas estupendas y que hay otras que podrían mejorarse bastante. Serás mucho mas objetivo.',
    },
    {
      image: 'img/amigos.jpg',
      title: 'Amigos para toda la vida',
      text: 'Conocerás gente de todas partes del mundo, compartirás experiencias inolvidables, momentos difíciles y horas de charlas, y seréis amigos para siempre por que al cruzar vuestros caminos todo fue diferente. Además a partir de este momento, seguro que ya no tienes excusas para ir a visitar a tus nuevos amigos en sus países, crearás una red de amistades internacional.',
    },
    {
      image: 'img/adventure.jpg',
      title: 'Romperás con tu rutina',
      text: 'Romperás tanto con tu rutina que será como una segunda vida, una oportunidad de hacer las cosas diferentes. Tendás tiempo para ti y para hacer lo que más te guste, ¡reinvéntate!',
    },
    {
      image: 'img/hablar.jpg',
      title: 'El placer de hablar otro idioma',
      text: 'Porque cuando al principio la comunicación se hace más compleja, con los días adquirirás más fluidez, vocabulario y sobre todo confianza y seguridad en ti mismo, y empezarás a entender las canciones que has cantado toda tu vida en plan wachu wachu!',
    },
    {
      image: 'img/viajar.jpg',
      title: 'Viajas',
      text: 'Te animarás a hacer muchísimas salidas entre semana y escapadas de fin de semana, puentes, vacaciones, estarás muy activo porque vas a querer aprovechar al máximo esta experiencia y tu memoria se llenará de momentos inolvidables.',
    },
    {
      image: 'img/curriculum.jpg',
      title: 'Mejorarás tu CV y tus oportunidades laborales',
      text: 'Porque tu perspectiva será más amplia, tu experiencia será diferente, confiaras mas en ti mismo y los cursos que realices darán a tu hoja de vida un valor mas agregado.',
    },
    {
      image: 'img/enriqueceras.jpg',
      title: '¡Enriquecerás tu vida!',
      text: 'Inspirarás a la gente que te rodea; a tus amigos, hermanos, familia a perseguir sus sueños y dar el salto.',
    },
    {
      image: 'img/feliz.jpg',
      title: '¡Serás feliz!',
      text: 'Y cuando cierres la etapa y mires para atrás, sabrás que fue lo correcto porque fue lo que querías hacer, con sus momentos duros y sus momentos de risas.',
    },
  ];

  toggleShowSideBar(): void {
    this.showSideBar = !this.showSideBar;
  }

  handleActions(event: { action: string }): void {
    if (event.action === 'close' && this.showSideBar) {
      this.toggleShowSideBar();
    }
  }

  goToContactForm(): void {
    document.querySelector('.hp-s9-contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
