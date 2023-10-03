import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
import { ToastService } from '@app/@core/services/toast.service';
import { Subscription } from 'rxjs';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';

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

  constructor(
    private toastService: ToastService,
    private service: QuestionnaireService,
    private errorService: ErrorHandlingService
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
        error: (err) => {
          this.errorService.generateError(
            err,
            'Get User Questionnaire',
            'An error getting your questionnaire. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
          );
        }
      })
  }

  updateQuestionnaire(questionnaire: Questionnaire) {
    this.service.updateUserQuestionnaire(this.user.id, questionnaire)
    .subscribe({
      next: () => this.toastService.showSuccess('Questionnaire Submitted'),
      error: (err) => {
        this.errorService.generateError(
          err,
          'Update User Questionnaire',
          'An error submitting your questionnaire. Please tray again and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    })
  }
}
