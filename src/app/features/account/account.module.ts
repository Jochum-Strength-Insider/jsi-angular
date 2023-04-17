import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';


@NgModule({
  declarations: [
    AccountComponent,
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class AccountModule { }
