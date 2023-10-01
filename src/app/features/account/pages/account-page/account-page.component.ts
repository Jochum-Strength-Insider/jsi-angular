import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit, OnDestroy {
  authUser: UserModel | null;
  authStatus: User | null;
  authUserSub: Subscription;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authUserSub = this.authService.currentUser$
    .subscribe((authUser) => {
      this.authUser = authUser;
    })

    this.authStatusSub = this.authService.currentAuthStatus$
    .subscribe((authStatus) => {
      this.authStatus = authStatus;
    })
  }

  ngOnDestroy(): void {
    this.authUserSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }

}
