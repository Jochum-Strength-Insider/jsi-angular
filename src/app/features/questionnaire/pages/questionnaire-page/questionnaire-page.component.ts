import { Component } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-questionnaire-page',
  templateUrl: './questionnaire-page.component.html',
  styleUrls: ['./questionnaire-page.component.css']
})
export class QuestionnairePageComponent {
  authUser$: Observable<User | null>;

  constructor(private authService: AuthService){
    this.authUser$ = this.authService.currentUser$;
  }
}