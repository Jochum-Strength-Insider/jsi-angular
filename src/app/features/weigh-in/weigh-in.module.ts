import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MonthCirclesComponent } from './components/month-circles/month-circles.component';
import { WeighInContainerComponent } from './components/weigh-in-container/weigh-in-container.component';
import { WeightChartComponent } from './components/weight-chart/weight-chart.component';
import { WeighInPageComponent } from './pages/weigh-in-page/weigh-in-page.component';
import { WeighInRoutingModule } from './weigh-in-routing.module';
import { WeighInComponent } from './weigh-in.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    WeighInComponent,
    WeighInContainerComponent,
    WeighInPageComponent,
    WeightChartComponent,
    MonthCirclesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    WeighInRoutingModule
  ],
  exports:[
    WeighInContainerComponent
  ]
})
export class WeighInModule { }
