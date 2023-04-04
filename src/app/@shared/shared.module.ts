import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSignOutButtonComponent } from './components/auth-sign-out-button/auth-sign-out-button.component';



@NgModule({
  declarations: [
    AuthSignOutButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AuthSignOutButtonComponent
  ]
})
export class SharedModule { }
