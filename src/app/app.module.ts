import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { HpTextContainerComponent } from './components/hp-text-container/hp-text-container.component';
import { HpGalleryParalaxComponent } from './components/hp-gallery-paralax/hp-gallery-paralax.component';
import { HpCardsParalaxComponent } from './components/hp-cards-paralax/hp-cards-paralax.component';
import { HpSliderExperiencesComponent } from './components/hp-slider-experiences/hp-slider-experiences.component';
import { FooterComponent } from './components/footer/footer.component';
import { HpSliderPartnersComponent } from './components/hp-slider-partners/hp-slider-partners.component';
import { HpBtnGotoContactComponent } from './components/hp-btn-goto-contact/hp-btn-goto-contact.component';
import { HpScOurDestinationsComponent } from './layouts/home/hp-sc-our-destinations/hp-sc-our-destinations.component';
import { HpScReasonsComponent } from './layouts/home/hp-sc-reasons/hp-sc-reasons.component';
import { HpScServicesComponent } from './layouts/home/hp-sc-services/hp-sc-services.component';
import { HpScStepsToFollowComponent } from './layouts/home/hp-sc-steps-to-follow/hp-sc-steps-to-follow.component';
import { HpScExperiencesComponent } from './layouts/home/hp-sc-experiences/hp-sc-experiences.component';
import { HpScTeamComponent } from './layouts/home/hp-sc-team/hp-sc-team.component';
import { HpScLearnEnglishComponent } from './layouts/home/hp-sc-learn-english/hp-sc-learn-english.component';
import { HpScContactComponent } from './layouts/home/hp-sc-contact/hp-sc-contact.component';
import { HpScPartnersComponent } from './layouts/home/hp-sc-partners/hp-sc-partners.component';
import { HpSidebarDoYouLackAHoppComponent } from './layouts/home/hp-sidebar-do-you-lack-a-hopp/hp-sidebar-do-you-lack-a-hopp.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopNavbarComponent,
    HpTextContainerComponent,
    HpGalleryParalaxComponent,
    HpCardsParalaxComponent,
    HpSliderExperiencesComponent,
    FooterComponent,
    HpSliderPartnersComponent,
    HpBtnGotoContactComponent,
    HpScOurDestinationsComponent,
    HpScReasonsComponent,
    HpScServicesComponent,
    HpScStepsToFollowComponent,
    HpScExperiencesComponent,
    HpScTeamComponent,
    HpScLearnEnglishComponent,
    HpScContactComponent,
    HpScPartnersComponent,
    HpSidebarDoYouLackAHoppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
