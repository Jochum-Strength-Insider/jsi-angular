import { Component } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weigh-in-page',
  templateUrl: './weigh-in-page.component.html',
  styleUrls: ['./weigh-in-page.component.css']
})
export class WeighInPageComponent {
  authUser$: Observable<User | null>;

  constructor(private authService: AuthService){
    this.authUser$ = this.authService.currentUser$;
  }
}
