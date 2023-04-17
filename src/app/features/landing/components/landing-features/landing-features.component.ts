import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-features',
  templateUrl: './landing-features.component.html',
  styleUrls: ['./landing-features.component.css']
})
export class LandingFeaturesComponent {
  featuresData = [
    {
      "icon": "fas fa-comments",
      "title": "One on One",
      "text": "Every single week you will have an online review session with a Jochum Strength coach."
    },
    {
      "icon": "fas fa-dumbbell",
      "title": "Programs",
      "text": "Individualized programs, utilizing 100's of exercises, that fit your goals."
    },
    {
      "icon": "fas fa-weight",
      "title": "Diet Sheets",
      "text": "Access to the Jochum Strength Diet Guidelines that we use with all of our clients."
    },
    {
      "icon": "fas fa-mobile",
      "title": "Mobile Experience",
      "text": "All of your lifting, mobility, and athletic movements programmed for you at the touch of your fingers."
    }
  ]
}
