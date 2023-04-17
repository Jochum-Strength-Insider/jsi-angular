import { Injectable } from '@angular/core';

import { formatDate } from '@angular/common';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { WeighIn } from '@app/@core/models/weigh-in/weigh-in.model';

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

  //  addWeighIn = (e) => {
  //   e.preventDefault();
  //   const timestamp = Number(moment(this.state.date).format("x"));
  //   const nowString = moment(this.state.date).format("MMM D");
  //   const lastDatestring = moment(this.state.lastDate).format("MMM D");

  //   // this check need to be redone. Maybe do a checkQuery function like in the diet page.
  //   if (lastDatestring === nowString) {
  //      this.setState({ invalid: true })
  //   } else {
  //      this.props.firebase.weighIn(this.props.authUser.uid).push({ date: timestamp, weight: this.state.weight })
  //         .then(this.hideAndValidateModal)
  //         .catch(error => this.setState({ error }))
  //   }
  // }
  addUserWeighIn(uid: string, weight: number): Observable<any> {
    const date = new Date();
    const timestamp = date.valueOf();
    // const nowString = formatDate(date, "MMM D", "en-US");
    // const lastDatestring = moment(this.state.lastDate).format("MMM D");
    return from(this.userWeighInListRef(uid).push({ date: timestamp, weight }))
  }

}
