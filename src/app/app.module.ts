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
   

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
