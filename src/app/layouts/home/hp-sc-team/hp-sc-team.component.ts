import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpGalleryParalaxComponent } from '../../../components/hp-gallery-paralax/hp-gallery-paralax.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { GalleryConfig } from '../../../components/hp-gallery-paralax/hp-gallery-paralax.component';

@Component({
  selector: 'app-hp-sc-team',
  imports: [HpTextContainerComponent, HpGalleryParalaxComponent, RevealDirective],
  templateUrl: './hp-sc-team.component.html',
  styleUrl: './hp-sc-team.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScTeamComponent {
  content: {
    subtitle: string;
    title: string;
    paragraph: string;
    gallery: GalleryConfig;
  } = {
    subtitle: 'Un equipo entero a tu disposición',
    title: 'Nuestro equipo',
    paragraph:
      'Te asesoramos gratuitamente sobre vuelos, seguros, preparativos para el viaje y resolvemos todas las dudas que tengas. Tu Hopper está allí y te lo cuenta todo, el también pasó por ello!',
    gallery: {
      steps: false,
      rellax: true,
      images: [
        { img: { path: 'img/natalia.webp' }, rellax: { speed: -1 } },
        { img: { path: 'img/silvia.webp' }, rellax: { speed: 1 } },
        { img: { path: 'img/tania.webp' }, rellax: { speed: -1 } },
      ],
    },
  };
}
