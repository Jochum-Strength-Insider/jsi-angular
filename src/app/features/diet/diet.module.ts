import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DietRoutingModule } from './diet-routing.module';
import { DietPageComponent } from './pages/diet-page/diet-page.component';
import { DietComponent } from './diet.component';


@NgModule({
  declarations: [
    DietComponent,
    DietPageComponent,
  ],
  imports: [
    CommonModule,
    DietRoutingModule
  ]
})
export class DietModule { }
