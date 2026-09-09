import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpCardsParalaxComponent } from '../../../components/hp-cards-paralax/hp-cards-paralax.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { ServiceCard } from '../../../components/hp-cards-paralax/hp-cards-paralax.component';

@Component({
  selector: 'app-hp-sc-services',
  imports: [HpTextContainerComponent, HpCardsParalaxComponent, RevealDirective],
  templateUrl: './hp-sc-services.component.html',
  styleUrl: './hp-sc-services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScServicesComponent {
  content = {
    subtitle: 'PROGRAMAS DE ESTUDIOS, GUIAS, DESCUENTOS y MAS',
    title: '¿Qué te ofrecemos?',
    paragraph:
      'Una experiencia completa. Con los mejores programas de estudio en el extranjero adaptados a tus necesidades. Te asesoramos con los trámites y los visados para que no tengas que preocuparte de nada.',
  };

  cards: ServiceCard[] = [
    { icon: 'img/icon_asesoria.PNG', title: 'Asesoria gratis y trámites online' },
    { icon: 'img/icon_oportunidades.PNG', title: 'Oportunidades para tí' },
    { icon: 'img/icon_informacion.PNG', title: 'Información durante la experiencia' },
  ];
}
