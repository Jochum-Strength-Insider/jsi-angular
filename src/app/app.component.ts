import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'client';
  ngOnInit(){
    console.log("APP_INIT", environment.test)
  }
}
