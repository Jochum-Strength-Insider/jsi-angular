import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramRoutingModule } from './program-routing.module';
import { ProgramComponent } from './program.component';
import { ProgramPageComponent } from './pages/program-page/program-page.component';
import { SharedModule } from '@app/@shared/shared.module';


@NgModule({
  declarations: [
    ProgramComponent,
    ProgramPageComponent
  ],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    SharedModule
  ]
})
export class ProgramModule { }
