import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { mapKeysToObjectArrayOperator, mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { Diet } from '@app/@core/models/diet/diet.model';

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
    
  // usersDiet = (uid, did) => this.db.ref(`diets/${uid}/${did}`);
  getUserDiet(uid: string, did: string):Observable<Diet> {
    return <Observable<Diet>>this.db.object(`mesdietssages/${uid}/${did}`)
    .snapshotChanges()
    .pipe( mapKeyToObjectOperator() );
  }

  // usersDiets = (uid) => this.db.ref(`diets/${uid}`);
  getUserDiets(uid: string): Observable<Diet[]> {
  return <Observable<Diet[]>>this.db.list(`diets/${uid}`)
    .snapshotChanges()
    .pipe( mapKeysToObjectArrayOperator() )
  }

  // dietIds = (uid) => this.db.ref(`dietIds/${uid}`);
  getUserDietIds(uid: string): Observable<Diet[]> {
  return <Observable<Diet[]>>this.db.list(`dietIds/${uid}`)
    .snapshotChanges()
    .pipe( mapKeysToObjectArrayOperator() )
  }
}
