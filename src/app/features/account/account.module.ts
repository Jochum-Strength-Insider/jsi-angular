import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './account-routing.module';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { SharedModule } from '@app/@shared/shared.module';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserImageComponent } from './components/user-image/user-image.component';


@NgModule({
  declarations: [
    AccountContainerComponent,
    AccountPageComponent,
    UserInfoComponent,
    UserImageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class AccountModule { }
