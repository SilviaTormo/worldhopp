import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpGalleryParalaxComponent } from '../../../components/hp-gallery-paralax/hp-gallery-paralax.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { GalleryConfig } from '../../../components/hp-gallery-paralax/hp-gallery-paralax.component';

@Component({
  selector: 'app-hp-sc-steps-to-follow',
  imports: [HpTextContainerComponent, HpGalleryParalaxComponent, RevealDirective],
  templateUrl: './hp-sc-steps-to-follow.component.html',
  styleUrl: './hp-sc-steps-to-follow.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScStepsToFollowComponent {
  content: {
    subtitle: string;
    title: string;
    paragraph: string;
    gallery: GalleryConfig;
  } = {
    subtitle: 'nosotros nos ocupamos de todo.',
    title: 'Pasos a seguir',
    paragraph:
      'Nuestro Hopper te informará y te ayudará a elegir. Además te matriculará y te asistirá con el Visado y todos los trámites de formalización. Realiza los preparativos, compra los vuelos y preguntanos las dudas de última hora. Te recibimos y damos los primeros pasos contigo. ',
    gallery: {
      steps: true,
      rellax: true,
      images: [
        {
          img: { path: 'img/decide.jpg' },
          title: { text: 'Infórmate y Decide', textVisibility: 2 },
          rellax: { speed: -1 },
        },
        {
          img: { path: 'img/city-1868530_1280.jpg' },
          title: { text: 'Conviertete en Worldhopper', textVisibility: 2 },
          rellax: { speed: 1 },
        },
        {
          img: { path: 'img/maletas.jpg' },
          title: { text: 'Haz las maletas', textVisibility: 2 },
          rellax: { speed: -1 },
        },
        {
          img: { path: 'img/welcome.jpg' },
          title: { text: 'Welcome to the Jungle!', textVisibility: 2 },
          rellax: { speed: 1 },
        },
      ],
    },
  };
}
