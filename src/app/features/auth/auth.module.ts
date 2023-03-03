import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './components/signin/signin.component';
import { EmailSigninComponent } from './components/email-signin/email-signin.component';
import { PasswordForgetComponent } from './components/password-forget/password-forget.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { SignupComponent } from './components/signup/signup.component';


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
    AuthRoutingModule
  ]
})
export class AuthModule { }
