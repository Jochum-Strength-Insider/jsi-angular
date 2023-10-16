import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveySubmittedGuard {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.currentUser$.pipe(
      map((user) => {
        if(user?.surveySubmitted){
          return true;
        } else {
          return this.router.createUrlTree(['/questionnaire']);
        }
      })
    )
  }
}
