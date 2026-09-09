import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SmartphoneSocialComponent } from '../../../components/smartphone-social/smartphone-social.component';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { RevealDirective } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-hp-sc-social',
  imports: [SmartphoneSocialComponent, HpTextContainerComponent, RevealDirective],
  templateUrl: './hp-sc-social.component.html',
  styleUrl: './hp-sc-social.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScSocialComponent {
  content = {
    subtitle: 'Unete a la comunidad de WorldHoppers',
    title: 'Es tu turno, el mundo está a tu alcance',
    paragraph: 'Explora nuestras redes y comparte con nosotros tu aventura.',
  };
}
