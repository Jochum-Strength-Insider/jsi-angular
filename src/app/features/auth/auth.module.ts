import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './pages/signin/signin.component';
import { EmailSigninComponent } from './pages/email-signin/email-signin.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DotsComponent } from './components/dots/dots.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/@shared/shared.module';
import { PasswordForgetComponent } from './pages/password-forget/password-forget.component';
import { ResubscribeComponent } from './pages/resubscribe/resubscribe.component';


@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    EmailSigninComponent,
    PasswordForgetComponent,
    SubscribeComponent,
    ResubscribeComponent,
    DotsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
