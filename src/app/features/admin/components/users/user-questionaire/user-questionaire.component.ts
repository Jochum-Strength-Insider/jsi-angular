import { Component, Input } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-user-questionaire',
  templateUrl: './user-questionaire.component.html',
  styleUrls: ['./user-questionaire.component.css']
})
export class UserQuestionaireComponent {
  @Input() user: User;
  @Input() loggedInUser: User;

}
