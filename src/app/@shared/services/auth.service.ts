
import { Injectable } from '@angular/core';
import {
  ActionCodeSettings,
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  initializeAuth,
  isSignInWithEmailLink,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updatePassword
} from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { environment } from '@env/environment';
import { initializeApp } from '@firebase/app';
import { BehaviorSubject, Observable, defer, map, of, switchMap } from 'rxjs';
import { LoginRequestModel } from '../models/auth/login-request.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userIsLoggedIn: boolean = false;

  private authStatus = new BehaviorSubject<User | null>(null);
  readonly currentAuthStatus$ = this.authStatus.asObservable();

  private currentUserSub = new BehaviorSubject<UserModel | null>(null);
  readonly currentUser$ = this.currentUserSub.asObservable();
  
  constructor(
    private auth: Auth,
    private db: AngularFireDatabase
    ) {
    this.onAuthStatusListener();
  }

  onAuthStatusListener(){
    this.auth.onAuthStateChanged((credential)=> {
      if(credential) {
        this.getUserById(credential.uid)
          .subscribe(( userResponse: UserModel ) => {
            if(userResponse){
              userResponse.emailVerified = credential.emailVerified;
              this.currentUserSub.next(userResponse);
              this.authStatus.next(credential);
            } else {
              this.clearUserInformation();
            }
          })
      } else {
        this.clearUserInformation();
      }
    })
  }

  clearUserInformation() {
    this.authStatus.next(null);
    this.currentUserSub.next(null);
    console.log('User is logged out');
  }
  
  login({ email, password }: LoginRequestModel): Observable<UserCredential> {
    return defer(() => signInWithEmailAndPassword(this.auth, email, password));
  }

  register({ email, password }: LoginRequestModel): Observable<UserCredential> {
    return defer(() => createUserWithEmailAndPassword(this.auth, email, password));
  }

  adminRegisterNewUser({email, password}: LoginRequestModel): Observable<UserCredential> {
    const otherApp = initializeApp(environment.firebase, "otherApp");
    const otherAuth = initializeAuth(otherApp);
    return defer(() => createUserWithEmailAndPassword(otherAuth, email, password))
      .pipe(
        switchMap((user) => defer(() => signOut(otherAuth)).pipe(map(() => user))),
      );
  }

  logout(): Observable<void> {
    return defer(() => signOut(this.auth));
  }

  public getCurrentAuthUser(){
    return this.auth.currentUser;
  }

  getUserById(userId: string):Observable<UserModel> {
    return <Observable<UserModel>>this.db.object(`users/${userId}`)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  mergeAuthUserAndDbUser( credential: User, user: UserModel ): UserModel {
    user.emailVerified = credential.emailVerified;
    return user;
  }

  // *** Auth API ***

  getSignInMethodsForEmail(email: string): Observable<string[]> {
    return defer( () => fetchSignInMethodsForEmail(this.auth, email));
  }

  sendPasswordReset(email: string) : Observable<void> {
    return defer( () => sendPasswordResetEmail(this.auth, email));
  }

  sendEmailVerification(user: User | null = null) : Observable<void> {
    const actionCodeSettings: ActionCodeSettings = { url: environment.firebase.confirmationEmailRedirect || "" }
    if(user) {
      return defer( () => sendEmailVerification(user, actionCodeSettings));
    } else {
      const currentUser = this.auth.currentUser;
      return currentUser
        ? defer( () => sendEmailVerification(currentUser, actionCodeSettings))
        : of();
    } 
  }

  updatePassword(user: User, password: string): Observable<void>{
    return defer( () => updatePassword(user, password));
  }

  sendSignInLinkToEmail(email: string): Observable<void> {
    const actionCodeSettings: ActionCodeSettings = {
      url: environment.firebase.emailSignInRedirect || '',
      handleCodeInApp: true
    }
    return defer( () => sendSignInLinkToEmail(this.auth, email, actionCodeSettings));
  }

  doSignInWithEmailLink(email: string): Observable<UserCredential> {
    return defer( () => signInWithEmailLink(this.auth, email, window.location.href));
  }

  getIsSignInWithEmailLink(): boolean {
    return isSignInWithEmailLink(this.auth, window.location.href)
  }

}