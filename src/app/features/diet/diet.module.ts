import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DietRoutingModule } from './diet-routing.module';
import { DietComponent } from './diet.component';


@NgModule({
  declarations: [
    DietComponent
  ],
  imports: [
    CommonModule,
    DietRoutingModule
  ]
})
export class DietModule { }
