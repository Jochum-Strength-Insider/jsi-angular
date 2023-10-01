import { Component } from '@angular/core';
import { AuthService } from '@app/@shared/services/auth.service';

@Component({
  selector: 'app-verify-email-card',
  templateUrl: './verify-email-card.component.html',
  styleUrls: ['./verify-email-card.component.css']
})
export class VerifyEmailCardComponent {
  emailSent: boolean = false;

  constructor(private authService: AuthService){}

  sendEmailVerification(){
    this.authService.sendEmailVerification()
    .subscribe({
      next: () => this.emailSent = true,
      error: (error: Error) => console.log(error)
    })
  }
}
