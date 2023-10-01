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
  private selectedUserSubject = new BehaviorSubject<UserModel | null>(null);
  public selectedUser$ = this.selectedUserSubject.asObservable();

  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService
  ) {}

  public setSelectedUser(user: UserModel | null){
    this.selectedUserSubject.next(user);
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

  updateUserProfile(user: UserModel): Observable<void> {
    return defer( () => this.usersObjectRef(user.id)
      .update({
        "username": user.username,
        "surveySubmitted": user.surveySubmitted,
        "billingId": user.billingId
      })
    )
  }

  updateUserProgramDate(uid: string){
    return defer( () => this.usersObjectRef(uid).update({ "programDate": new Date().getTime() }))
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

  addNewUser(uid: string, email: string, username: string, billingId: string = ""): Observable<void> {
    const now = new Date().getTime();
    const newUser = new UserModel();
    newUser.username = username;
    newUser.email = email;
    newUser.ADMIN = false;
    newUser.ACTIVE = true;
    newUser.createdAt = now;
    newUser.surveySubmitted = false;
    newUser.billingId = billingId;
    return defer(() => this.usersObjectRef(uid).set(newUser));
  }
}
