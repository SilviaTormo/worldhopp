import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HpTextContainerComponent } from '../../../components/hp-text-container/hp-text-container.component';
import { HpSliderExperiencesComponent } from '../../../components/hp-slider-experiences/hp-slider-experiences.component';
import { RevealDirective } from '../../../shared/reveal.directive';
import { ExperienceSlide } from '../../../components/hp-slider-experiences/hp-slider-experiences.component';

@Component({
  selector: 'app-hp-sc-experiences',
  imports: [HpTextContainerComponent, HpSliderExperiencesComponent, RevealDirective],
  templateUrl: './hp-sc-experiences.component.html',
  styleUrl: './hp-sc-experiences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HpScExperiencesComponent {
  content = {
    subtitle: 'Conoce la comunidad de Worldhoppers',
    title: 'Otros ya lo han hecho!',
    paragraph:
      'Estás a punto de emprender una nueva aventura, conoce la historia de otros Worldhoppers que se han lanzado a estudiar, trabajar y vivir en el extranjero.',
    slider: [
      {
        photo: 'img/fabio.jpg',
        user: '',
        nombre: 'Fabio',
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.',
        origen: 'Chile',
        destino: 'Nueva Zelanda',
      },
      {
        photo: 'img/leidy.jpg',
        user: '',
        nombre: 'Leidy',
        comment:
          '"Cuando decidí venir a Irlanda a aprender inglés me sorprendió un pais maravilloso en el que las personas están dispuestas a ayudarte siempre".',
        origen: 'Colombia',
        destino: 'Irlanda',
      },
      {
        photo: 'img/marina.jpg',
        user: '',
        nombre: 'Marina',
        comment:
          '"No tenía nada claro todo lo necesario para poder salir del país con tranquilidad. Worldhopp me lo puso fácil"',
        origen: 'Colombia',
        destino: 'Irlanda',
      },
    ] as ExperienceSlide[],
  };
}
