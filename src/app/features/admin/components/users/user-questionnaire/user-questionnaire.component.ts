import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
import { ErrorHandlingService } from '@app/@core/services/error-handling.service';
import { ToastService } from '@app/@core/services/toast.service';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { QuestionnaireService } from '@app/features/questionnaire/services/questionnaire.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-questionnaire',
  templateUrl: './user-questionnaire.component.html',
  styleUrls: ['./user-questionnaire.component.css']
})
export class UserQuestionnaireComponent implements OnChanges, OnDestroy {
  @Input() user: User;
  @Input() adminUser: User | null;
  
  questionnaireSub: Subscription;
  questionnaire: Questionnaire;

  constructor(
    private questionnaireService: QuestionnaireService,
    private toastService: ToastService,
    private errorService: ErrorHandlingService
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged( changes['user'], () => {
      this.fetchUserQuestionnaire();
    });
  }

  ngOnDestroy(): void {
    this.questionnaireSub?.unsubscribe();
  }

  fetchUserQuestionnaire() {
    this.questionnaireSub = this.questionnaireService
    .getUserQuestionnaire(this.user.id)
    .subscribe({
      next: (questionnaire) => {
        this.questionnaire = questionnaire;
      },
      error: (err) => {
        this.errorService.generateError(
          err,
          'Fetch User Questionnaire',
          'An error occurred while getting the questionnaire. Please refresh the page and reach out to support if the error continues.'
        )
      }
    })
  }

  updateQuestionnaire(questionnaire: Questionnaire) {
    this.questionnaireService.updateUserQuestionnaire(this.user.id, questionnaire)
    .subscribe({
      next: () => {
        this.toastService.showSuccess('User Questionnaire Updated');
      },
      error: (err) => {
       this.errorService.generateError(
          err,
          'Update User Questionnaire',
          'An error occurred while submitting the questionnaire. Please try again and reach out to support if the error continues.'
        );
      }
    })
  }
}
