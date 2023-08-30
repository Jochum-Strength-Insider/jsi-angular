import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { QuestionnairePageComponent } from './pages/questionnaire-page/questionnaire-page.component';
import { QuestionnaireContainerComponent } from './components/questionnaire-container/questionnaire-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionnaireFormComponent } from './components/questionnaire-form/questionnaire-form.component';


@NgModule({
  declarations: [
    QuestionnairePageComponent,
    QuestionnaireContainerComponent,
    QuestionnaireFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuestionnaireRoutingModule
  ],
  exports: [
    QuestionnaireFormComponent
  ]
})
export class QuestionnaireModule { }
