import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './pages/signin/signin.component';
import { EmailSigninComponent } from './pages/email-signin/email-signin.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DotsComponent } from './components/dots/dots.component';
import { PaymentComponent } from './components/payment/payment.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/@shared/shared.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { PromoComponent } from './components/promo/promo.component';


@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    EmailSigninComponent,
    SubscribeComponent,
    SignupComponent,
    DotsComponent,
    PaymentComponent,
    PromoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    AuthRoutingModule,
    SharedModule,
    NgxPayPalModule
  ]
})
export class AuthModule { }
