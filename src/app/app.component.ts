import { Component } from '@angular/core';
import { Event, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { environment } from '@env/environment';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div [class.switch-container]="showNav">
      <app-header *ngIf="showNav"/>
      <div class="contain container-fluid no-padding">
        <app-toasts></app-toasts>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  showNav: boolean = true;

  constructor(private router: Router) {
    router.events
      .pipe(filter((e: Event): e is RouterEvent => e instanceof NavigationEnd))
      .subscribe((e: RouterEvent) => {
          this.showNav = !e.url.includes('/auth/subscribe') && !e.url.includes('/auth/signup')
      });
  }  

  ngOnInit(){
    console.log("APP_INIT", environment.test)
  }

}
