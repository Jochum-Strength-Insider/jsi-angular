import { Component, Input } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';

@Component({
  selector: 'app-navigation-auth',
  templateUrl: './navigation-auth.component.html',
  styleUrls: ['./navigation-auth.component.css']
})
export class NavigationAuthComponent {
  @Input() onSelect: Function;
  @Input() onToggle: Function;
  @Input() isExpanded: boolean;
  @Input() authUser: User;
}
