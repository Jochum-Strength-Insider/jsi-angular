import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequestModel } from '@app/@shared/models/auth/login-request.model';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: []
})
export class AuthComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(loginRequest: LoginRequestModel) {
    this.auth.login(loginRequest)
    .then(() => this.router.navigate(['/program']))
    .catch((e) => console.log(e.message));;
  }
}
