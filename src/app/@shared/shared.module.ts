import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SignOutButtonComponent } from './components/auth/sign-out-button/sign-out-button.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { SanitizeUrlPipe } from './pipes/sanitize-url.pipe';
import { VerifyEmailCardComponent } from './components/verify-email-card/verify-email-card.component';



@NgModule({
  declarations: [
    SignOutButtonComponent,
    SpinnerComponent,
    ResetPasswordComponent,
    SanitizeUrlPipe,
    VerifyEmailCardComponent
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    ReactiveFormsModule
  ],
  exports: [
    SignOutButtonComponent,
    ResetPasswordComponent,
    SpinnerComponent,
    SanitizeUrlPipe,
    VerifyEmailCardComponent
  ],
})
export class SharedModule { }
