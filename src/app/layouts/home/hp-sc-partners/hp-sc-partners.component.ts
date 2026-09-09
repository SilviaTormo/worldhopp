import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpSliderPartnersComponent } from '../../../components/hp-slider-partners/hp-slider-partners.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { PartnerSlide } from '../../../components/hp-slider-partners/hp-slider-partners.component';

@Component({
  selector: 'app-hp-sc-partners',
  imports: [HpSliderPartnersComponent, RevealDirective],
  templateUrl: './hp-sc-partners.component.html',
  styleUrl: './hp-sc-partners.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScPartnersComponent {
  content = {
    slider: [
      { img: 'img/partners/Lonely_Planet.svg.png', name: 'Lonely Planet', description: '', url: '' },
      { img: 'img/partners/cdmon.png', name: 'cdmon', description: '', url: '' },
      { img: 'img/partners/wuxanos_logo.png', name: 'Wuxanos', description: 'Los minions kawaii mas monis', url: 'http://wuxanos.com/' },
      { img: 'img/partners/platzi_logo.png', name: 'Platzi', description: '', url: '' },
    ] as PartnerSlide[],
  };
}
