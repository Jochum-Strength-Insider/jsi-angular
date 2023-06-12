import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { DietId } from '@app/@core/models/diet/diet-id.model';
import { Diet } from '@app/@core/models/diet/diet.model';
import { mapKeyToObjectOperator, mapKeysToObjectArrayOperator } from '@app/@core/utilities/mappings.utilities';
import { isNonNull } from '@app/@core/utilities/type-check.utilities';
import * as moment from 'moment';
import { BehaviorSubject, Observable, filter, first, from, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DietService {

  dietsSub = new BehaviorSubject<Diet[]>([]);
  diets$ = this.dietsSub.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // // *** Diet API ***

  userDietsListRef(uid: string): AngularFireList<Diet> {
    return this.db.list(`diets/${uid}`)
  }
  
  userDietObjectRef(uid: string, did: string): AngularFireObject<Diet> {
    return this.db.object(`diets/${uid}/${did}`)
  }

  getUserDiet(uid: string, did: string): Observable<Diet> {
    return <Observable<Diet>>this.db.object(`diets/${uid}/${did}`)
      .snapshotChanges()
      .pipe(mapKeyToObjectOperator());
  }

  getUserDiets(uid: string): Observable<Diet[]> {
    return <Observable<Diet[]>>this.db.list(`diets/${uid}`)
      .snapshotChanges()
      .pipe(mapKeysToObjectArrayOperator())
  }

  getUserDietsForWeekByDate(uid: string, date: Date): Observable<Diet[]> {
    const startOfWeek = +moment(date).startOf('w').format('x');
    const endOfWeek = +moment(date).endOf('w').format('x');
    const dietsRef = this.db.list(
      `diets/${uid}`,
      ref => ref.orderByChild("createdAt").startAt(startOfWeek).endAt(endOfWeek)
    );

    return <Observable<Diet[]>>dietsRef
      .valueChanges([], { idField: 'id' })
      .pipe(
        first(),
      );
  }

  addUserDietSheet(uid: string, date: number): Observable<DietId> {
    const startOfDate = +moment(date).startOf('d').format('x');
    const diet = new Diet(startOfDate);
    return of(this.userDietsListRef(uid).push(diet).key)
      .pipe(
        filter(isNonNull),
        switchMap(
          (key: string) => from(this.userDietIdObjectRef(uid).update({ [key]: diet.createdAt })).pipe(
            map(() => ({ [key]: diet.createdAt }))
          )
        )
      );
  }

  saveUserDiet(uid: string, diet: Diet){
    const updateRef = this.userDietObjectRef(uid, diet.id);
    return from(updateRef.update({ meals: diet.meals, rating: diet.rating }));
  }
  
  // // *** DietIds API ***
  
  userDietIdsListRef(uid: string): AngularFireList<DietId> {
    return this.db.list(`dietIds/${uid}`)
  }

  userDietIdObjectRef(uid: string): AngularFireObject<DietId> {
    return this.db.object(`dietIds/${uid}`)
  }

  getUserDietIdByDate(uid: string, date: Date): Observable<DietId | null> {
    const startOfDate = +moment(date).startOf('d').format('x');
    const dietsRef = this.db.list(
      `dietIds/${uid}`,
      ref => ref.orderByValue().equalTo(startOfDate).limitToLast(1)
    );

    return <Observable<DietId | null>>dietsRef
      .snapshotChanges()
      .pipe(
        first(),
        map(changes => changes.map((change: any) => ({ [change.payload.key]: change.payload.toJSON() }))),
        map(dietIds => dietIds.length > 0 ? dietIds[0] : null),
      )
  }
}
