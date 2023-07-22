import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersPageComponent } from './pages/admin-users-page/admin-users-page.component';
import { AdminProgramsPageComponent } from './pages/admin-programs-page/admin-programs-page.component';
import { AdminCodesPageComponent } from './pages/admin-codes-page/admin-codes-page.component';
import { AdminExercisesPageComponent } from './pages/admin-exercises-page/admin-exercises-page.component';
import { CodesListComponent } from './components/codes/codes-list/codes-list.component';
import { CodesItemComponent } from './components/codes/codes-item/codes-item.component';
import { CodesFormComponent } from './components/codes/codes-form/codes-form.component';
import { CodesComponent } from './components/codes/codes/codes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksComponent } from './components/tasks/tasks/tasks.component';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminFoldersPageComponent } from './pages/admin-folders-page/admin-folders-page.component';
import { AdminResourcesPageComponent } from './pages/admin-resources-page/admin-resources-page.component';
import { FoldersComponent } from './components/folders/folders/folders.component';
import { FolderComponent } from './components/folders/folder/folder.component';
import { AdminProgramComponent } from './components/programs/program/admin-program.component';
import { AdminProgramTableComponent } from './components/programs/program-table/admin-program-table.component';
import { AdminPhaseTableComponent } from './components/programs/phase-table/admin-phase-table.component';
import { AdminExerciseRowComponent } from './components/programs/exercise-row/admin-exercise-row.component';
import { AdminDayTableComponent } from './components/programs/day-table/admin-day-table.component';
import { CellFormComponent } from './components/programs/cell-form/cell-form.component';
import { MatAutoCompleteComponent } from './components/programs/mat-auto-complete/mat-auto-complete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AdminUsersPageComponent,
    AdminUsersPageComponent,
    AdminProgramsPageComponent,
    AdminCodesPageComponent,
    AdminExercisesPageComponent,
    AdminFoldersPageComponent,
    AdminResourcesPageComponent,
    CodesComponent,
    CodesFormComponent,
    CodesListComponent,
    CodesItemComponent,
    CodesFormComponent,
    TasksComponent,
    FoldersComponent,
    FolderComponent,
    AdminProgramComponent,
    AdminProgramTableComponent,
    AdminPhaseTableComponent,
    AdminExerciseRowComponent,
    AdminDayTableComponent,
    CellFormComponent,
    MatAutoCompleteComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    MatAutocompleteModule
  ]
})
export class AdminModule { }
