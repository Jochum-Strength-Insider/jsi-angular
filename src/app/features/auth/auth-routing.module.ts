import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailSigninComponent } from './pages/email-signin/email-signin.component';
import { PasswordForgetComponent } from '@app/features/auth/pages/password-forget/password-forget.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectLoggedInToProgram = () => redirectLoggedInTo(['program']);


const routes: Routes = [
  { path: '',   redirectTo: '/auth/signin', pathMatch: 'full' },
  {
     path: 'signin', component: SigninComponent,
    ...canActivate(redirectLoggedInToProgram),
  },
  { path: 'signup', component: SignupComponent },
  { path: 'subscribe', component: SubscribeComponent },
  {
    path: 'email-signin', component: EmailSigninComponent,
    ...canActivate(redirectLoggedInToProgram),
  },
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
