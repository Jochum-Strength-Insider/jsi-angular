import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DietRoutingModule } from './diet-routing.module';
import { DietPageComponent } from './pages/diet-page/diet-page.component';
import { DietComponent } from './diet.component';
import { DietContainerComponent } from './components/diet-container/diet-container.component';
import { DietSheetComponent } from './components/diet-sheet/diet-sheet.component';
import { DietFormRowComponent } from './components/diet-form-row/diet-form-row.component';
import { DietDateCirclesComponent } from './components/diet-date-circles/diet-date-circles.component';
import { NgbAccordionModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DietComponent,
    DietPageComponent,
    DietContainerComponent,
    DietSheetComponent,
    DietFormRowComponent,
    DietDateCirclesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DietRoutingModule,
    NgbAccordionModule,
    NgbCollapseModule
  ],
  exports: [
    DietContainerComponent
  ]
})
export class DietModule { }
