import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './account-routing.module';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { SharedModule } from '@app/@shared/shared.module';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UserImageComponent } from './components/user-image/user-image.component';
import { UserCancellationComponent } from './components/user-cancellation/user-cancellation.component';


@NgModule({
  declarations: [
    AccountContainerComponent,
    AccountPageComponent,
    UserInfoComponent,
    UserImageComponent,
    UserCancellationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ]
})
export class AccountModule { }
