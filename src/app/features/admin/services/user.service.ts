import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { BehaviorSubject, Observable, defer, map, tap } from 'rxjs';

export const USERS_STRING = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService
  ) {}

  public setCurrentUser(user: UserModel | null){
    this.currentUserSubject.next(user);
  }

  private usersListRef(): AngularFireList<UserModel>{
    return this.db.list(USERS_STRING);
  }

  private usersObjectRef(uid: string): AngularFireObject<UserModel>{
    return this.db.object(`${USERS_STRING}/${uid}`);
  }

  getUserById(userId: string):Observable<UserModel> {
    return this.usersObjectRef(userId)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getUsers(): Observable<UserModel[]> {
    return this.usersListRef()
      .valueChanges([], { idField: 'id'})
      .pipe(
        tap((users) => this.lsService.saveStringifyData(USERS_STRING, users)),
        map(users => users)
      );
  }

  getActiveUsers(): Observable<UserModel[]> {
      const usersListRef = this.db.list(USERS_STRING, ref => ref.orderByChild("ACTIVE").equalTo(true) );
      return <Observable<UserModel[]>>usersListRef
        .valueChanges([], { idField: 'id'});
  }

  isUserActive(userId: string): Observable<boolean> {
    return <Observable<boolean>>this.db.object(`${USERS_STRING}/${userId}/ACTIVE`)
      .valueChanges()
  }

  setUserIsActive(uid: string, active: boolean): Observable<void> {
    const userRef = this.usersObjectRef(uid)
    return defer( () => userRef.update({ "ACTIVE": active }))
      .pipe( tap(() => this.lsService.removeData(USERS_STRING)) );
  }
  
}
