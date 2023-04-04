import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MessageIconComponent } from './components/message-icon/message-icon.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NavigationAuthComponent } from './components/navigation-auth/navigation-auth.component';
import { AdminUnreadComponent } from './components/admin-unread/admin-unread.component';
import { NavigationLoginFormComponent } from './components/navigation-login-form/navigation-login-form.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';



@NgModule({
  declarations: [
    HeaderComponent,
    MessageIconComponent,
    NavigationComponent,
    NavigationAuthComponent,
    AdminUnreadComponent,
    NavigationLoginFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
