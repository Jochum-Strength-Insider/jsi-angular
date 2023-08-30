import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersPageComponent } from './pages/admin-users-page/admin-users-page.component';
import { AdminProgramsPageComponent } from './pages/admin-programs-page/admin-programs-page.component';
import { AdminCodesPageComponent } from './pages/admin-codes-page/admin-codes-page.component';
import { AdminExercisesPageComponent } from './pages/admin-exercises-page/admin-exercises-page.component';
import { CodesComponent } from './components/codes/codes/codes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksListComponent } from './components/tasks/tasks-list/tasks-list.component';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminFoldersPageComponent } from './pages/admin-folders-page/admin-folders-page.component';
import { AdminResourcesPageComponent } from './pages/admin-resources-page/admin-resources-page.component';
import { FoldersComponent } from './components/folders/folders/folders.component';
import { FolderComponent } from './components/folders/folder/folder.component';
import { AdminProgramComponent } from './components/programs/program/admin-program.component';
import { AdminProgramTableComponent } from './components/programs/program-table/admin-program-table.component';
import { AdminPhaseTableComponent } from './components/programs/phase-table/admin-phase-table.component';
import { AdminDayTableComponent } from './components/programs/day-table/admin-day-table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AutoCompleteComponent } from './components/programs/auto-complete/auto-complete.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { AdminPanelComponent } from './components/users/admin-panel/admin-panel.component';
import { UserItemComponent } from './components/users/user-item/user-item.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { UserProgramsListComponent } from './components/users/user-programs-list/user-programs-list.component';
import { UserDietComponent } from './components/users/user-diet/user-diet.component';
import { UserMessagesComponent } from './components/users/user-messages/user-messages.component';
import { UserWeightComponent } from './components/users/user-weight/user-weight.component';
import { UserProgramComponent } from './components/users/user-program/user-program.component';
import { MessagesModule } from '../messages/messages.module';
import { DietModule } from '../diet/diet.module';
import { WeighInModule } from '../weigh-in/weigh-in.module';
import { AdminResourcesComponent } from './components/resources/resources/resources.component';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';
import { UserQuestionnaireComponent } from './components/users/user-questionnaire/user-questionnaire.component';


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
    TasksListComponent,
    FoldersComponent,
    FolderComponent,
    AdminProgramComponent,
    AdminProgramTableComponent,
    AdminPhaseTableComponent,
    AdminDayTableComponent,
    AutoCompleteComponent,
    UsersListComponent,
    AdminPanelComponent,
    UserItemComponent,
    UserProfileComponent,
    UserProgramsListComponent,
    UserDietComponent,
    UserMessagesComponent,
    UserWeightComponent,
    UserProgramComponent,
    UserQuestionnaireComponent,
    AdminResourcesComponent
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
    NgbDropdownModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MessagesModule,
    DietModule,
    WeighInModule,
    QuestionnaireModule
  ]
})
export class AdminModule { }
