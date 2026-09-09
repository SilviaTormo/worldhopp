import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpGalleryParalaxComponent } from '../../../components/hp-gallery-paralax/hp-gallery-paralax.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { GalleryConfig } from '../../../components/hp-gallery-paralax/hp-gallery-paralax.component';

@Component({
  selector: 'app-hp-sc-our-destinations',
  imports: [HpTextContainerComponent, HpGalleryParalaxComponent, RevealDirective],
  templateUrl: './hp-sc-our-destinations.component.html',
  styleUrl: './hp-sc-our-destinations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScOurDestinationsComponent {
  content: {
    subtitle: string;
    title: string;
    paragraph: string;
    gallery: GalleryConfig;
  } = {
    subtitle: 'Estas a un Hopp de cambiar tu vida',
    title: 'Nuestros destinos',
    paragraph:
      'Lánzate a una aventura única en nuestros hábitats. Tu sueño de viajar y estudiar convertido en una experiencia que será inolvidable. Lets Hopp Together!',
    gallery: {
      steps: false,
      rellax: true,
      images: [
        {
          img: { path: 'img/nz.jpg', text: 'New Zeland', textVisibility: 0, color: '#1684F5' },
          title: { text: 'KIWIhopp', textVisibility: 2, color: '#1684F5' },
          rellax: { speed: -1 },
        },
        {
          img: { path: 'img/malta.jpg', text: 'Malta', textVisibility: 0, color: '#F5A623' },
          title: { text: 'MALTAhopp', textVisibility: 2, color: '#F5A623' },
          rellax: { speed: 1 },
        },
        {
          img: { path: 'img/irlanda.jpg', text: 'Ireland', textVisibility: 0, color: '#1BBA99' },
          title: { text: 'IRELANDhopp', textVisibility: 2, color: '#1BBA99' },
          rellax: { speed: -1 },
        },
        {
          img: { path: 'img/bcn.jpg', text: 'Barcelona', textVisibility: 0, color: '#CA3D4E' },
          title: { text: 'BARCELONAhopp', textVisibility: 2, color: '#CA3D4E' },
          rellax: { speed: 1 },
        },
      ],
    },
  };
}
