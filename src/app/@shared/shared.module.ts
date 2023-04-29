import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSignOutButtonComponent } from './components/auth-sign-out-button/auth-sign-out-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';



@NgModule({
  declarations: [
    AuthSignOutButtonComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AuthSignOutButtonComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
