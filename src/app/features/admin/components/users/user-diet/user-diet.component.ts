import { Component, Input } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-user-diet',
  templateUrl: './user-diet.component.html',
  styleUrls: ['./user-diet.component.css']
})
export class UserDietComponent {
  @Input() user: User;
  @Input() loggedInUser: User | null;
}
