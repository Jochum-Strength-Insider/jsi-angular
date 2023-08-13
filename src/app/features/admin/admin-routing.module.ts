import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersPageComponent } from './pages/admin-users-page/admin-users-page.component';
import { AdminProgramsPageComponent } from './pages/admin-programs-page/admin-programs-page.component';
import { AdminExercisesPageComponent } from './pages/admin-exercises-page/admin-exercises-page.component';
import { AdminCodesPageComponent } from './pages/admin-codes-page/admin-codes-page.component';
import { AdminFoldersPageComponent } from './pages/admin-folders-page/admin-folders-page.component';
import { AdminResourcesPageComponent } from './pages/admin-resources-page/admin-resources-page.component';
import { FolderComponent } from './components/folders/folder/folder.component';
import { FoldersComponent } from './components/folders/folders/folders.component';
import { AdminProgramComponent } from './components/programs/program/admin-program.component';
import { UserItemComponent } from './components/users/user-item/user-item.component';
import { UserProgramComponent } from './components/users/user-program/user-program.component';
import { UserQuestionaireComponent } from './components/users/user-questionaire/user-questionaire.component';

/* 
ToDo:
Program routes
admin/create-program
admin/folders/folder-id
admin/create-program/program/program-id

https://insider.jochumstrength.com/create-program
https://insider.jochumstrength.com/create-program/folders/all
https://insider.jochumstrength.com/create-program/folders/-NO1K5v5rlEz4MzLNunX
https://insider.jochumstrength.com/create-program/-MazAMPfeXylS_yKOncr
*/



const routes: Routes = [
  {
    path: 'users',
    component: AdminUsersPageComponent,
    children: [
      {
        path: ':uid', component: UserItemComponent,
      },
    ]
  },
  {
    path: 'users/:uid/program/:pid',
    component: UserProgramComponent,
  },
  {
    path: 'programs',
    component: AdminProgramsPageComponent,
    children: [
      { path: ':pid', component: AdminProgramComponent },
    ]
  },
  {
    path: 'folders',
    component: AdminFoldersPageComponent,
    children: [
      {path: 'list', component: FoldersComponent },
      {path: 'all', component: FolderComponent, data :{ folder: "all" } },
      {path: 'uncategorized', component: FolderComponent, data :{ folder: "uncategorized" }  },
      {path: ':id', component: FolderComponent },
    ]
  },
  { path: 'exercises', component: AdminExercisesPageComponent },
  { path: 'codes', component: AdminCodesPageComponent },
  { path: 'resources', component: AdminResourcesPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
