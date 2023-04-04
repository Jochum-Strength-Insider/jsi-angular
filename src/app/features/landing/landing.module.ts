import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LandingProgramComponent } from './components/landing-program/landing-program.component';
import { LandingSplashComponent } from './components/landing-splash/landing-splash.component';
import { LandingFeaturesComponent } from './components/landing-features/landing-features.component';
import { LandingResultsComponent } from './components/landing-results/landing-results.component';
import { LandingCtaComponent } from './components/landing-cta/landing-cta.component';
import { LandingVideoComponent } from './components/landing-video/landing-video.component';
import { LandingDetailsComponent } from './components/landing-details/landing-details.component';
import { LandingCarouselComponent } from './components/landing-carousel/landing-carousel.component';
import { LandingSignupComponent } from './components/landing-signup/landing-signup.component';
import { LandingFooterComponent } from './components/landing-footer/landing-footer.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';


@NgModule({
  declarations: [
    LandingComponent,
    LandingProgramComponent,
    LandingSplashComponent,
    LandingFeaturesComponent,
    LandingResultsComponent,
    LandingCtaComponent,
    LandingVideoComponent,
    LandingDetailsComponent,
    LandingCarouselComponent,
    LandingSignupComponent,
    LandingFooterComponent,
    LandingPageComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
