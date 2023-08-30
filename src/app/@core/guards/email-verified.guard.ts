import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailVerifiedGuard {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.currentUser$.pipe(
      map((user) => {
        if(user?.emailVerified){
          return true;
        } else {
          return this.router.createUrlTree(['/verify-email']);
        }
      })
    )
  }
}
