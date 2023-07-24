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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksListComponent } from './components/tasks/tasks-list/tasks-list.component';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminFoldersPageComponent } from './pages/admin-folders-page/admin-folders-page.component';
import { AdminResourcesPageComponent } from './pages/admin-resources-page/admin-resources-page.component';
import { FoldersComponent } from './components/folders/folders/folders.component';
import { FolderComponent } from './components/folders/folder/folder.component';
import { AdminProgramComponent } from './components/programs/program/admin-program.component';
import { AdminProgramTableComponent } from './components/programs/program-table/admin-program-table.component';
import { AdminPhaseTableComponent } from './components/programs/phase-table/admin-phase-table.component';
import { AdminDayTableComponent } from './components/programs/day-table/admin-day-table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutoCompleteComponent } from './components/programs/auto-complete/auto-complete.component';


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
    TasksListComponent,
    FoldersComponent,
    FolderComponent,
    AdminProgramComponent,
    AdminProgramTableComponent,
    AdminPhaseTableComponent,
    AdminDayTableComponent,
    AutoCompleteComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    MatAutocompleteModule
  ]
})
export class AdminModule { }
