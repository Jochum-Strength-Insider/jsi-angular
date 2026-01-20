import { Component } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { environment } from '@env/environment';
import { filter, map } from 'rxjs';

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
    this.router.events
      .pipe(
        filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
        map(e => e.urlAfterRedirects ?? e.url)
      )
      .subscribe(url => {
        this.showNav =
          !url.includes('/auth/subscribe') &&
          !url.includes('/auth/signup') &&
          !url.includes('/auth/resubscribe');
      });
  }

  ngOnInit() {
    if (!environment.production) {
      console.log("APP_INIT", environment.firebase)
    }
  }

}
