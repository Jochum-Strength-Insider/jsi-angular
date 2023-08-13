import { Component, Input } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-user-weight',
  templateUrl: './user-weight.component.html',
  styleUrls: ['./user-weight.component.css']
})
export class UserWeightComponent {
  @Input() user: User;
  @Input() loggedInUser: User | null;
}
