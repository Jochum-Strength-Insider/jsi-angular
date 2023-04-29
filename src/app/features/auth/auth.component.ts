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
}
