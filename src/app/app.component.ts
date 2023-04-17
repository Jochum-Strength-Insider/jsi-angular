import { Component } from '@angular/core';
import { RouterEvent } from '@angular/router';
import { Event, NavigationEnd, Router } from '@angular/router';
import { environment } from '@env/environment';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div [class.switch-container]="showNav">
      <app-header *ngIf="showNav"/>
      <div class="container-fluid contain no-padding">
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
          this.showNav = e.url !== '/auth/subscribe' && e.url !== '/auth/signup'
      });
  }  

  ngOnInit(){
    console.log("APP_INIT", environment.test)
  }

}
