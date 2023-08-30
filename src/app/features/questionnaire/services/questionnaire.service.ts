import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
import { Observable, defer, switchMap } from 'rxjs';

export const QUESTIONNAIRE_STRING = 'questionnaire';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  constructor(
    private db: AngularFireDatabase,
  ) { }

  // *** Questionnaire API ***

  private questionnairesListRef(uid: string): AngularFireList<Questionnaire> {
    return this.db.list(`${QUESTIONNAIRE_STRING}`);
  }

  private userQuestionnaireObjectRef(uid: string): AngularFireObject<Questionnaire> {
    return this.db.object(`${QUESTIONNAIRE_STRING}/${uid}`);
  }

  getUserQuestionnaire(uid: string):Observable<Questionnaire> {
    return <Observable<Questionnaire>>this.userQuestionnaireObjectRef(uid)
      .valueChanges();
  }

  addUserQuestionnaire(uid: string, questionnaire: Questionnaire): Observable<void> {
    return defer(() => this.userQuestionnaireObjectRef(uid).set(questionnaire) );
  }

  updateUserQuestionnaire(uid: string, questionnaire: Questionnaire): Observable<void> {
    return defer(() => this.userQuestionnaireObjectRef(uid).update(questionnaire) )
      .pipe(switchMap(() => this.setUserSurverySubmitted(uid, true) ));
  }

  removeUserQuestionnaire(uid: string): Observable<void> {
    return defer(() => this.userQuestionnaireObjectRef(uid).remove() );
  }

  private usersObjectRef(uid: string): AngularFireObject<User>{
    return this.db.object(`users/${uid}`);
  }

  setUserSurverySubmitted(uid: string, submitted: boolean): Observable<void> {
    return defer(() => this.usersObjectRef(uid).update({ surveySubmitted: submitted }))
  }
}