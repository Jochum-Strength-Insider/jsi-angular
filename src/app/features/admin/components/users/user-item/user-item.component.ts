import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { UserService } from '@app/features/admin/services/user.service';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, tap } from 'rxjs';


@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent {
  @ViewChild('nav') nav: NgbNav;

  authUser: User | null;
  selectedUser: User | null;
  authUserSub: Subscription;
  selectedUserSub: Subscription;

  active: number = 1;
  activeTitle: string = 'Profile'
  navItems: Array<{id: number, title: string}> = [
    { id: 1, title: 'Profile' },
    { id: 2, title: 'Programs' },
    { id: 3, title: 'Messages' },
    { id: 4, title: 'Diet' },
    { id: 5, title: 'Weight' },
    { id: 6, title: 'Questionnaire' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ){ }

  ngOnInit(){
    this.selectedUserSub = this.userService.selectedUser$
      .subscribe((user) => {
        this.selectedUser = user
      });

    this.authUserSub = this.authService.currentUser$
      .subscribe((user) => {
        if(user && !user.ADMIN){
          this.router.navigateByUrl('/signin')
          return;
        }
        this.authUser = user;
      })
  }

  selectNavItem(id: number) {
    this.nav.select(id);
  }

  changeTitle(id: number){
    this.activeTitle = this.navItems.find(x => x.id === id)?.title || "User";
  }

  ngOnDestroy(){
    this.authUserSub?.unsubscribe();
    this.selectedUserSub?.unsubscribe();
  }
}
