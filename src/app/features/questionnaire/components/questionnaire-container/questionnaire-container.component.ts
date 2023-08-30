import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
import { ToastService } from '@app/@core/services/toast.service';
import { Subscription } from 'rxjs';
import { QuestionnaireService } from '../../services/questionnaire.service';

@Component({
  selector: 'app-questionnaire-container',
  templateUrl: './questionnaire-container.component.html',
  styleUrls: ['./questionnaire-container.component.css']
})
export class QuestionnaireContainerComponent implements OnInit, OnDestroy {
  @Input() user: UserModel;
  @Input() authStatus: User;

  questionnaireSub: Subscription;
  questionnaire: Questionnaire;

  error: Error;

  constructor(
    private toastService: ToastService,
    private service: QuestionnaireService
  ){ }

  ngOnInit() {
    this.fetchQuestionnaire();
  }

  ngOnDestroy(): void {
    this.questionnaireSub?.unsubscribe();
  }

  fetchQuestionnaire(){
    this.questionnaireSub = this.service
      .getUserQuestionnaire(this.user.id)
      .subscribe({
        next: (questionnaire) => {
          this.questionnaire = questionnaire
        },
        error: (err) => this.error = err
      })
  }

  updateQuestionnaire(questionnaire: Questionnaire) {
    this.service.updateUserQuestionnaire(this.user.id, questionnaire)
    .subscribe({
      next: () => this.toastService.showSuccess('Questionnaire Submitted'),
      error: (err) => {
        this.error = err;
        this.toastService.showError();
      }
    })
  }
}
