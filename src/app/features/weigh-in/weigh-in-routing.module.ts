import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeighInComponent } from './weigh-in.component';

const routes: Routes = [{ path: '', component: WeighInComponent }];

// <Route path={ROUTES.WEIGH_IN} component={WeighInPage} />

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighInRoutingModule { }
