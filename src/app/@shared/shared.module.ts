import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordForgetComponent } from '../features/auth/pages/password-forget/password-forget.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignOutButtonComponent } from './components/auth/sign-out-button/sign-out-button.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';



@NgModule({
  declarations: [
    SignOutButtonComponent,
    SpinnerComponent,
    PasswordForgetComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    ReactiveFormsModule
  ],
  exports: [
    SignOutButtonComponent,
    ResetPasswordComponent,
    SpinnerComponent
  ],
})
export class SharedModule { }
