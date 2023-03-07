import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { EmailSigninComponent } from './pages/email-signin/email-signin.component';
import { PasswordForgetComponent } from './pages/password-forget/password-forget.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'email-signin', component: EmailSigninComponent },
  { path: 'forgot-password', component: PasswordForgetComponent },
];

// <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
// <Route exact path={ROUTES.SIGN_IN_LINK} component={EmailSignInPage} />
// <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
// <Route path={ROUTES.SUBSCRIBE} component={Payment} />
// <Route path={ROUTES.SIGN_UP} component={SignUpWithPayment} />

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
