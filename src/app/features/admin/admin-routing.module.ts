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
  { path: 'users', component: AdminUsersPageComponent },
  {
    path: 'programs',
    component: AdminProgramsPageComponent,
    children: [
      {path: ':id', component: AdminFoldersPageComponent },
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

  // {
  //   path: 'home',
  //   component: homeComponent,
  //   children: [
  //     {
  //       path: 'module1',
  //       component: module1Component,
  //       children: [
  //         {
  //           path: 'submodule11',
  //           component: submodule11Component,
  //         },
  //         {
  //           path: '',
  //           redirectTo: 'submodule11',
  //           pathMatch: 'full'
  //         }
  //       ]
  //     },
  //     {
  //       path: 'module2',
  //       component: module2omponent,
  //       children: [
  //         {
  //           path: 'submodule21',
  //           component: submodule21Component,
  //         },
  //         {
  //           path: '',
  //           redirectTo: 'submodule21',
  //           pathMatch: 'full'
  //         }
  //       ]
  //     }
  //   ]
  // },

// <Route path={ROUTES.ADMIN} component={AdminPage} />
// <Route path={ROUTES.CREATE_PROGRAM} component={CreateProgram} />
// <Route path={ROUTES.CREATE_TASK} component={CreateTask} />
// <Route path={ROUTES.CREATE_CODE} component={CreateCodes} />

// <Route path={ROUTES.ADMIN_MESSAGES} component={AdminChat} />
// <Route path={ROUTES.WORKOUTS} component={AdminUserProgramsPage} />

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
