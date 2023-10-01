import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-out-button',
  templateUrl: './sign-out-button.component.html',
  styleUrls: ['./sign-out-button.component.css']
})
export class SignOutButtonComponent {
  constructor(
    private auth: AuthService,
    private lsService: LocalStorageService,
    private router: Router
  ) {}

  logout(){
    this.auth.logout()
    .pipe(finalize(() => this.lsService.clearData()))
    .subscribe({
      next: () => this.router.navigate(['/auth/signin'])
    })
  }
}
