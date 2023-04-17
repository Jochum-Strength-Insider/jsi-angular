import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './pages/signin/signin.component';
import { EmailSigninComponent } from './pages/email-signin/email-signin.component';
import { PasswordForgetComponent } from './pages/password-forget/password-forget.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DotsComponent } from './components/dots/dots.component';
import { StepsComponent } from './components/steps/steps.component';
import { PaymentComponent } from './components/payment/payment.component';


@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    EmailSigninComponent,
    PasswordForgetComponent,
    SubscribeComponent,
    SignupComponent,
    DotsComponent,
    StepsComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
