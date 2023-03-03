import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'diet', loadChildren: () => import('./features/diet/diet.module').then(m => m.DietModule) },
  { path: 'messages', loadChildren: () => import('./features/messages/messages.module').then(m => m.MessagesModule) },
  { path: 'program', loadChildren: () => import('./features/program/program.module').then(m => m.ProgramModule) },
  { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
  { path: 'weigh-in', loadChildren: () => import('./features/weigh-in/weigh-in.module').then(m => m.WeighInModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
