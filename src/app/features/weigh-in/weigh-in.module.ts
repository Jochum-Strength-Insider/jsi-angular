import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeighInRoutingModule } from './weigh-in-routing.module';
import { WeighInComponent } from './weigh-in.component';


@NgModule({
  declarations: [
    WeighInComponent
  ],
  imports: [
    CommonModule,
    WeighInRoutingModule
  ]
})
export class WeighInModule { }
