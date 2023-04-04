import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeighInRoutingModule } from './weigh-in-routing.module';
import { WeighInComponent } from './weigh-in.component';
import { WeighInPageComponent } from './pages/weigh-in-page/weigh-in-page.component';


@NgModule({
  declarations: [
    WeighInComponent,
    WeighInPageComponent
  ],
  imports: [
    CommonModule,
    WeighInRoutingModule
  ]
})
export class WeighInModule { }
