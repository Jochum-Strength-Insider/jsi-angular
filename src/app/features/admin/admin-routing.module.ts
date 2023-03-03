import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [{ path: '', component: AdminComponent }];

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
