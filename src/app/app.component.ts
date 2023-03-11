import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center" class="content">
    <ul>
      <li>
        <h2><a routerLink="/">Home</a></h2>
      </li>
      <li>
        <h2><a routerLink="/auth">Login</a></h2>
      </li>
      <li>
        <h2><a routerLink="/program">Workout</a></h2>
      </li>
    </ul>
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
