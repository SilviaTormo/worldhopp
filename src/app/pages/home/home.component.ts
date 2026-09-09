import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TopNavbarComponent } from '../../components/top-navbar/top-navbar.component';
import { HpScOurDestinationsComponent } from '../../layouts/home/hp-sc-our-destinations/hp-sc-our-destinations.component';
import { HpScReasonsComponent } from '../../layouts/home/hp-sc-reasons/hp-sc-reasons.component';
import { HpScServicesComponent } from '../../layouts/home/hp-sc-services/hp-sc-services.component';
import { HpScStepsToFollowComponent } from '../../layouts/home/hp-sc-steps-to-follow/hp-sc-steps-to-follow.component';
import { HpScExperiencesComponent } from '../../layouts/home/hp-sc-experiences/hp-sc-experiences.component';
import { HpScTeamComponent } from '../../layouts/home/hp-sc-team/hp-sc-team.component';
import { HpScLearnEnglishComponent } from '../../layouts/home/hp-sc-learn-english/hp-sc-learn-english.component';
import { HpScContactComponent } from '../../layouts/home/hp-sc-contact/hp-sc-contact.component';
import { HpScPartnersComponent } from '../../layouts/home/hp-sc-partners/hp-sc-partners.component';
import { HpScSocialComponent } from '../../layouts/home/hp-sc-social/hp-sc-social.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MenuAnchor } from '../../components/top-navbar/top-navbar.component';

@Component({
  selector: 'app-home',
  imports: [
    TopNavbarComponent,
    HpScOurDestinationsComponent,
    HpScReasonsComponent,
    HpScServicesComponent,
    HpScStepsToFollowComponent,
    HpScExperiencesComponent,
    HpScTeamComponent,
    HpScLearnEnglishComponent,
    HpScContactComponent,
    HpScPartnersComponent,
    HpScSocialComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  menu: MenuAnchor[] = [
    { name: 'Destinos', id: 'destinations', section: '.hp-s2-our-destinations' },
    { name: 'Servicios', id: 'services', section: '.hp-s4-services' },
    { name: 'Equipo', id: 'team', section: '.hp-s7-team' },
    { name: 'Contacto', id: 'contact', section: '.hp-s9-contact' },
  ];
}
