import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramComponent } from './program.component';

const routes: Routes = [{ path: '', component: ProgramComponent }];

// <Route path={ROUTES.USER_PROGRAM} component={UserProgramPage} />

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
