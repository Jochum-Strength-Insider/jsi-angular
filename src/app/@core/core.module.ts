import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { NgbCollapse, NgbDropdownModule, NgbPopoverModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminUnreadComponent } from './components/admin-unread/admin-unread.component';
import { HeaderComponent } from './components/header/header.component';
import { MessageIconComponent } from './components/message-icon/message-icon.component';
import { NavigationAuthComponent } from './components/navigation-auth/navigation-auth.component';
import { NavigationLoginFormComponent } from './components/navigation-login-form/navigation-login-form.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ToastsContainer } from './components/toasts-container/toasts-container.component';
import { SafePipe } from './pipes/safe.pipe';
import { FromNowPipe } from './pipes/from-now.pipe';


@NgModule({
  declarations: [
    HeaderComponent,
    MessageIconComponent,
    NavigationComponent,
    NavigationAuthComponent,
    AdminUnreadComponent,
    NavigationLoginFormComponent,
    SafePipe,
    ToastsContainer,
    FromNowPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbCollapse,
    NgbToastModule,
    NgbPopoverModule
  ],
  exports: [
    HeaderComponent,
    ToastsContainer
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
