import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToProgram = () => redirectLoggedInTo(['program']);

const routes: Routes = [
  { 
    path:  '',
    loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule),
    ...canActivate(redirectLoggedInToProgram)
  },
  { 
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    ...canActivate(redirectUnauthorizedToLogin)
    // Same as
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  { 
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  { 
    path: 'diet-sheet',
    loadChildren: () => import('./features/diet/diet.module').then(m => m.DietModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { 
    path: 'messages',
    loadChildren: () => import('./features/messages/messages.module').then(m => m.MessagesModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { 
    path: 'program',
    loadChildren: () => import('./features/program/program.module').then(m => m.ProgramModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { 
    path: 'account',
    loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { 
    path: 'weigh-in',
    loadChildren: () => import('./features/weigh-in/weigh-in.module').then(m => m.WeighInModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}