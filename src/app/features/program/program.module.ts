import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramRoutingModule } from './program-routing.module';
import { ProgramComponent } from './program.component';
import { ProgramPageComponent } from './pages/program-page/program-page.component';
import { SharedModule } from '@app/@shared/shared.module';
import { ProgramTableComponent } from './components/program-table/program-table.component';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbModalModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRowComponent } from './components/exercise-row/exercise-row.component';
import { PhaseTableComponent } from './components/phase-table/phase-table.component';
import { DayTableComponent } from './components/day-table/day-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { YoutubePipePipe } from './pipes/youtube-pipe.pipe';
import { YoutubeEmbedComponent } from './components/youtube-embed/youtube-embed.component';


@NgModule({
  declarations: [
    ProgramComponent,
    ProgramPageComponent,
    ProgramTableComponent,
    ExerciseRowComponent,
    PhaseTableComponent,
    DayTableComponent,
    YoutubePipePipe,
    YoutubeEmbedComponent
  ],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbModalModule,
    NgbCollapseModule,
    NgbAccordionModule,
    SharedModule
  ]
})
export class ProgramModule { }
