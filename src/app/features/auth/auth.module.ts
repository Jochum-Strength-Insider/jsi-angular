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


@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    EmailSigninComponent,
    PasswordForgetComponent,
    SubscribeComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
