import { Component } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-diet-page',
  templateUrl: './diet-page.component.html',
  styleUrls: ['./diet-page.component.css']
})
export class DietPageComponent {
  authUser$: Observable<User | null>;

  constructor(private authService: AuthService){
    this.authUser$ = this.authService.currentUser$;
  }
}