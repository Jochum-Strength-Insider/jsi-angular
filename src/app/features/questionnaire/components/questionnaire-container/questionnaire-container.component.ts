import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
import { ToastService } from '@app/@core/services/toast.service';
import { Subscription } from 'rxjs';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/@shared/services/auth.service';

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
    private service: QuestionnaireService,
    private toastService: ToastService,
    private errorService: ErrorHandlingService,
    private authService: AuthService,
    private router: Router
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
            'An error occurred while trying to get your questionnaire. Please refresh the page and reach out to your Jochum Strengh trainer if the error continues.'
          );
        }
      })
  }

  updateQuestionnaire(questionnaire: Questionnaire) {
    this.service.updateUserQuestionnaire(this.user.id, questionnaire)
    .subscribe({
      next: () => {
        if(!this.user.surveySubmitted) {
          this.toastService.showSuccess('Questionnaire Submitted. Redirecting to program page.');
          this.authService.refreshCurrentUser();
          setTimeout(() => {
            this.router.navigate(['program']);
          }, 1000);
        } else {
          this.toastService.showSuccess('Questionnaire Updated');
        }
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Update User Questionnaire',
          'An error occurred while trying to submit your questionnaire. Please try again and reach out to your Jochum Strengh trainer if the error continues.'
        );
      }
    })
  }
}
