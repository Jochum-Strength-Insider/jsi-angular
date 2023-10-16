import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailSigninComponent } from './pages/email-signin/email-signin.component';
import { PasswordForgetComponent } from '@app/features/auth/pages/password-forget/password-forget.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SubscribeComponent } from './pages/subscribe/subscribe.component';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ResubscribeComponent } from './pages/resubscribe/resubscribe.component';


const redirectLoggedInToProgram = () => redirectLoggedInTo(['program']);

const routes: Routes = [
  { path: '',   redirectTo: '/auth/signin', pathMatch: 'full' },
  {
     path: 'signin', component: SigninComponent,
    ...canActivate(redirectLoggedInToProgram),
  },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'resubscribe', component: ResubscribeComponent },
  {
    path: 'email-signin', component: EmailSigninComponent,
    ...canActivate(redirectLoggedInToProgram),
  },
  { path: 'forgot-password', component: PasswordForgetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
