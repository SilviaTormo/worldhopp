import { Component, OnInit, Input } from '@angular/core';

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
        photo: '../../../assets/img/water-1245677_1280.jpg',
        user: '',
        // tslint:disable-next-line:max-line-length
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.'
      },
      {
        photo: '../../../assets/img/girls-1209321_1280.jpg',
        user: '',
        // tslint:disable-next-line:max-line-length
        comment: 'Jaime, 30 Años,  Chile - Cork. Conocer a Natalia fue lo que necesitaba para que me pareciera el viaje posible. ¡Todo salió perfecto! Muchas gracias Worldhopp.'
        
      },
      {
        photo: '../../../assets/img/men-2425121_1280.jpg',
        user: '',
        // tslint:disable-next-line:max-line-length
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum erat quis nibh pulvinar mattis.'
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
