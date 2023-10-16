import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { WeighIn } from '@app/@core/models/weigh-in/weigh-in.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import * as moment from 'moment';
import { BehaviorSubject, Observable, defer, first, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeighInService {
  weighInSub = new BehaviorSubject<WeighIn | null>(null);
  weighIn$ = this.weighInSub.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) { }

   // *** Weight Ins API ***

   // weighIn = (uid) => this.db.ref(`weighIns/${uid}`);
   userWeighInObjectRef(uid: string):  AngularFireObject<WeighIn> {
    return this.db.object(`weighIns/${uid}`)
  }

  userWeighInListRef(uid: string):  AngularFireList<WeighIn> {
    return this.db.list(`weighIns/${uid}`)
  }

   getUserWeighIns(uid: string):Observable<WeighIn> {
    return <Observable<WeighIn>>this.userWeighInObjectRef(uid)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getWeighInsByMonthAndUser(uid: string, month: Date):Observable<WeighIn[]> {
    let startOf = Number(moment(month).startOf("month").format("x"));
    let endOf = Number(moment(month).endOf("month").format("x"));
    const weighInsRef = this.db.list(
      `weighIns/${uid}`,
      ref => ref.orderByChild("date").startAt(startOf).endAt(endOf)
    );

    return <Observable<WeighIn[]>>weighInsRef
    .valueChanges([], { idField: 'id' })
    .pipe(first());
  }

  getMostRecentUserWeighIn(uid: string) : Observable<WeighIn[]> {
    const weighInsRef = this.db.list(
      `weighIns/${uid}`,
      ref => ref.orderByChild("date").limitToLast(1)
    );

    return <Observable<WeighIn[]>>weighInsRef
    .valueChanges([], { idField: 'id' });
  }

  addUserWeighIn(uid: string, weighIn: WeighIn): Observable<any> {
    return defer( () => this.userWeighInListRef(uid).push(weighIn))
  }

  public removeUserWeighIns(uid: string): Observable<void> {
    return defer( () => this.userWeighInListRef(uid).remove())
  }
}
