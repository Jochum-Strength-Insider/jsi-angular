import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnairePageComponent } from './pages/questionnaire-page/questionnaire-page.component';

const routes: Routes = [{ path: '', component: QuestionnairePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
