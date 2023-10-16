import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { UserSubscription } from '@app/@core/models/auth/user-subscription.model';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { BehaviorSubject, Observable, defer, of, tap } from 'rxjs';

export const USERS_STRING = 'users';
export const USER_SUBSCRIPTION_STRING = 'userSubscriptions';

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

  public setSelectedUser(user: UserModel | null) {
    this.selectedUserSubject.next(user);
  }

  /* User Api */

  private usersListRef(): AngularFireList<UserModel>{
    return this.db.list(USERS_STRING);
  }

  private usersObjectRef(uid: string): AngularFireObject<UserModel>{
    return this.db.object(`${USERS_STRING}/${uid}`);
  }

  getUserById(userId: string): Observable<UserModel> {
    return this.usersObjectRef(userId)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getUsers(): Observable<UserModel[]> {
    return this.usersListRef()
      .valueChanges([], { idField: 'id'})
      .pipe(
        tap((users) => this.lsService.saveStringifyData(USERS_STRING, users)),
      );
  }

  updateUserProfile(user: UserModel): Observable<void> {
    return defer( () => this.usersObjectRef(user.id)
      .update({
        "username": user.username,
        "surveySubmitted": user.surveySubmitted,
        "ADMIN": user.ADMIN,
        "ACTIVE": user.ACTIVE,
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

  addNewUser(uid: string, email: string, username: string): Observable<void> {
    const now = new Date().getTime();
    const newUser = new UserModel();
    newUser.username = username;
    newUser.email = email;
    newUser.ADMIN = false;
    newUser.ACTIVE = true;
    newUser.createdAt = now;
    newUser.surveySubmitted = false;
    return defer(() => this.usersObjectRef(uid).set(newUser));
  }

  /* User Subscriptions API */

  private userSubscriptionListRef(uid: string): AngularFireList<UserSubscription>{
    return this.db.list(`${USER_SUBSCRIPTION_STRING}/${uid}`);
  }

  private userSubscriptionObjectRef(uid: string, sid: string): AngularFireObject<UserSubscription>{
    return this.db.object(`${USER_SUBSCRIPTION_STRING}/${uid}/${sid}`);
  }

  getUserSubscriptions(uid: string): Observable<UserSubscription[]> {
    return this.userSubscriptionListRef(uid)
      .valueChanges([], {idField: 'id'})
  }

  addUserSubscription(uid: string, billingId: string, subscriptionId: string, active: boolean = true): Observable<string | null> {
    const subscription = new UserSubscription(billingId, subscriptionId, active);
    return of(this.userSubscriptionListRef(uid).push(subscription).key)
  }

  updateUserSubscription(uid: string, subscription: UserSubscription): Observable<void> {
    return defer(() => this.userSubscriptionListRef(uid).update(subscription.id, subscription))
  }

  removeUserSubscription(uid: string, sid: string) : Observable<void> {
    return defer( () => this.userSubscriptionObjectRef(uid, sid).remove())
  }

  cancelUserSubscription(uid: string, sid: string): Observable<void> {
    return defer(() => this.userSubscriptionObjectRef(uid, sid).update({ active: false, cancelledAt: new Date().getTime() }));
  }
  
}
