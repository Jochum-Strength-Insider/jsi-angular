import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-sign-out-button',
  templateUrl: './sign-out-button.component.html',
  styleUrls: ['./sign-out-button.component.css']
})
export class SignOutButtonComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout(){
    this.auth.logout()
    .subscribe({
      next: () => this.router.navigate(['/auth/signin'])
    })
  }
}
