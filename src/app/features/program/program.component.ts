import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-program',
  template: `
    <p>
      program works!
    </p>
    <button (click)="logout()">
      logout
    </button>
  `,
  styles: [
  ]
})
export class ProgramComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  logout(){
    this.auth.logout()
    .then(() => this.router.navigate(['/auth']))
    .catch((e) => console.log(e.message));
  }
}
