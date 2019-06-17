import { Component, OnInit, Input } from '@angular/core';
import { OriginalSource } from 'webpack-sources';

@Component({
  selector: 'app-hp-sc-experiences',
  templateUrl: './hp-sc-experiences.component.html',
  styleUrls: ['./hp-sc-experiences.component.css']
})
export class HpScExperiencesComponent implements OnInit {

  content = {
    subtitle: 'Conoce la comunidad de Worldhoppers',
    title: 'Otros ya lo han hecho!',
    // tslint:disable-next-line:max-line-length
    paragraph: 'Estás a punto de emprender una nueva aventura, conoce la historia de otros Worldhoppers que se han lanzado a estudiar, trabajar y vivir en el extranjero.',
    slider: [
      {
        photo: '../../../assets/img/fabio.jpg',
        user: '',
        // tslint:disable-next-line:max-line-length
        nombre: 'Fabio',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.',
        origen:'Chile',
        destino: 'Nueva Zelanda'
      },
      {
        photo: '../../../assets/img/leidy.jpg',
        user: '',
        // tslint:disable-next-line:max-line-length
        nombre: 'Leidy',
        comment: '"Cuando decidí venir a Irlanda a aprender inglés me sorprendió un pais maravilloso en el que las personas están dispuestas a ayudarte siempre".',
        origen: 'Colombia',
        destino: 'Irlanda'
      },
      {
        photo: '../../../assets/img/marina.jpg',
        nombre: 'Marina',
        // tslint:disable-next-line:max-line-length
        comment: '"No tenía nada claro todo lo necesario para poder salir del país con tranquilidad. Worldhopp me lo puso fácil"',
        origen: 'Colombia',
        destino: 'Irlanda'
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
