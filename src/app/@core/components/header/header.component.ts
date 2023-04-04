import { Component, OnInit } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { InfoService } from '@app/@shared/services/info.service';
import { UserService } from '@app/@shared/services/user.service';
import { AccountService } from '@app/features/account/services/account.service';
import { catchError, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isExpanded: boolean = false;
  authUser$: Observable<User | null>;

  constructor(
    private authService : AuthService,
  ) {
    this.authUser$ = this.authService.currentUser$;
  }

  ngOnInit(){ }

  onSelect = () => this.isExpanded = false;
  onToggle = () => this.isExpanded = !this.isExpanded;
}
