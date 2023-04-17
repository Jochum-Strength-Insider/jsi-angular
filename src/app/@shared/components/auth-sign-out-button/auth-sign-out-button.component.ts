import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-auth-sign-out-button',
  templateUrl: './auth-sign-out-button.component.html',
  styleUrls: ['./auth-sign-out-button.component.css']
})
export class AuthSignOutButtonComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout(){
    this.auth.logout()
    .then(() => this.router.navigate(['/auth/signin']))
    .catch((e) => console.log(e.message));
  }
}
