import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietComponent } from './diet.component';

const routes: Routes = [{ path: '', component: DietComponent }];

// <Route path={ROUTES.DIET} component={DietPage} />

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DietRoutingModule { }
