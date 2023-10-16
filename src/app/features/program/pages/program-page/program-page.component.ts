import { Component } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-program-page',
  templateUrl: './program-page.component.html',
  styleUrls: ['./program-page.component.css']
})
export class ProgramPageComponent {
  authUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
  ){
    this.authUser$ = this.authService.currentUser$;
  }
}