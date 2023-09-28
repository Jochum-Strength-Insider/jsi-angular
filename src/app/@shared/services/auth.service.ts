
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
import { BehaviorSubject, Observable, defer, finalize, map, switchMap } from 'rxjs';
import { LoginRequestModel } from '../models/auth/login-request.model';

// Need to check questionniare submit on sign-in and redirect to questionnaire page.
// Need to force email validation on sign-in
// Show verify email/submit questionnaire card on program page.

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

  // doCreateUserWithEmailAndPassword = (email, password) => {
  //   const secondaryApp = firebase.initializeApp(config, "Secondary");
  //   const newUser = secondaryApp.auth().createUserWithEmailAndPassword(email, password)
  //   return new Promise(function (resolve, reject) {
  //     resolve({ newUser, secondaryApp });
  //   });
  // };
  register({ email, password }: LoginRequestModel): Observable<UserCredential> {
    return defer(() => createUserWithEmailAndPassword(this.auth, email, password));
  }

  adminRegisterNewUser({email, password}: LoginRequestModel): Observable<UserCredential> {
     // firebase.initializeApp(config, "Secondary");
    // const newUser = secondaryApp.auth().createUserWithEmailAndPassword(email, password)
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

  // // can you send this to a non current user?
  // doSendEmailVerification = () =>
  //   this.auth.currentUser.sendEmailVerification({
  //     url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT || process.env.REACT_APP_DEV_CONFIRMATION_EMAIL_REDIRECT,
  //   });
  sendEmailVerification(user: User) : Observable<void> {
    const RESET_OPTIONS = {
      url: environment.firebase.confirmationEmailRedirect
      || environment.firebase.confirmationEmailRedirect
    }
    return defer( () => sendEmailVerification(user));
  }

  sendNewUserEmailVerification(user: User) : Observable<void> {
    const actionCodeSettings: ActionCodeSettings = {
      url: environment.firebase.confirmationEmailRedirect || ''
    }
    return defer( () => sendEmailVerification(user, actionCodeSettings));
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