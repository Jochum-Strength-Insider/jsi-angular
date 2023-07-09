import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { ProgramService } from '@app/features/program/services/program.service';
import { Observable, tap } from 'rxjs';

/* ToDo:
Figure out the nested routing
Figure out how to structure the admin navigation
  Only have a Programs or Folders link
*/

@Component({
  selector: 'app-admin-folders-page',
  templateUrl: './admin-folders-page.component.html',
  styleUrls: ['./admin-folders-page.component.css']
})
export class AdminFoldersPageComponent {
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
