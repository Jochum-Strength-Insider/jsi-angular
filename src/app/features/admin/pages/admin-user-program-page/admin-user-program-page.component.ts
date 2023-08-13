import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-admin-user-program-page',
  templateUrl: './admin-user-program-page.component.html',
  styleUrls: ['./admin-user-program-page.component.css']
})
export class AdminUserProgramPageComponent {
  authUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
    ){
    this.authUser$ = this.authService.currentUser$.pipe(
      tap((user) => { if(user && !user.ADMIN){ this.router.navigateByUrl('/signin') } })
    );
  }
}
