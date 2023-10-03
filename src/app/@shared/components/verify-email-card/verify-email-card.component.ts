import { Component } from '@angular/core';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { AuthService } from '@app/@shared/services/auth.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-verify-email-card',
  templateUrl: './verify-email-card.component.html',
  styleUrls: ['./verify-email-card.component.css']
})
export class VerifyEmailCardComponent {
  emailSent: boolean = false;

  constructor(
    private authService: AuthService,
    private errorService: ErrorHandlingService
  ){}

  sendEmailVerification(){
    this.authService.sendEmailVerification()
    .subscribe({
      next: () => this.emailSent = true,
      error: (err) => {
        this.errorService.generateError(
          err,
          'Verify Email',
          'An error occurred while trying to send a verification email. Please try and again and reach out to support if the error continues.'
        );
      }
    })
  }
}
