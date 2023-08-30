import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
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

  error: Error;

  constructor(private questionnaireService: QuestionnaireService){}

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
      error: (err) => this.error = err
    })
  }
}
