import { Component } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  collapsed: boolean = true;
  authUser$: Observable<User | null>;

  constructor(
    private authService : AuthService,
  ) {
    this.authUser$ = this.authService.currentUser$;
  }

  onSelect = () => this.collapsed = true;
  onToggle = () => this.collapsed = !this.collapsed;
}
