
import { Injectable } from '@angular/core';
import { LoginRequestModel } from '../models/auth/login-request.model';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  ActionCodeSettings,
  UserCredential,
  fetchSignInMethodsForEmail
} from '@angular/fire/auth';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { environment } from '@env/environment';

// snapshotChanges includes metadata
// valueChanges does not

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
    private db: AngularFireDatabase,
    ) {
    this.onAuthStatusListener();
  }

  onAuthStatusListener(){
    this.auth.onAuthStateChanged((credential)=> {
      if(credential) {
        console.log('User is logged in');
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
  
  // doSignInWithEmailAndPassword = (email, password) =>
  //   this.auth.signInWithEmailAndPassword(email, password);
  login({ email, password }: LoginRequestModel) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // doCreateUserWithEmailAndPassword = (email, password) => {
  //   const secondaryApp = firebase.initializeApp(config, "Secondary");
  //   const newUser = secondaryApp.auth().createUserWithEmailAndPassword(email, password)
  //   return new Promise(function (resolve, reject) {
  //     resolve({ newUser, secondaryApp });
  //   });
  // };
  register({ email, password }: LoginRequestModel) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
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
  // fetchSignInMethodsForEmail = (email) => this.auth.fetchSignInMethodsForEmail(email);
  getSignInMethodsFormEmail(email: string): Observable<string[]> {
    return from(fetchSignInMethodsForEmail(this.auth, email));
  }

  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  sendPasswordReset(email: string) : Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
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
    return from(sendEmailVerification(user));
  }

  // doSendNewUserEmailVerification = (authUser) =>
  //   authUser.sendEmailVerification({
  //     url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT || process.env.REACT_APP_DEV_CONFIRMATION_EMAIL_REDIRECT,
  //   });
  sendNewUserEmailVerification(user: User) : Observable<void> {
    const actionCodeSettings: ActionCodeSettings = {
      url: environment.firebase.confirmationEmailRedirect || ''
    }
    return from(sendEmailVerification(user, actionCodeSettings));
  }

  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);
  updatePassword(user: User, password: string): Observable<void>{
    return from(updatePassword(user, password));
  }

  // doSendSignInLinkToEmail = (email) => {
  //   const actionCodeSettings = {
  //     url: process.env.REACT_APP_EMAIL_SIGN_IN_REDIRECT || process.env.REACT_APP_DEV_EMAIL_SIGN_IN_REDIRECT,
  //     handleCodeInApp: true,
  //   };
  //   return this.auth.sendSignInLinkToEmail(email, actionCodeSettings);
  // }
  sendSignInLinkToEmail(email: string): Observable<void> {
    const actionCodeSettings: ActionCodeSettings = {
      url: environment.firebase.emailSignInRedirect || '',
      handleCodeInApp: true
    }
    return from(sendSignInLinkToEmail(this.auth, email, actionCodeSettings));
  }

  // doSignInWithEmailLink = (email, location) =>
  //   this.auth.signInWithEmailLink(email, location);
  doSignInWithEmailLink(email: string): Observable<UserCredential> {
    return from(signInWithEmailLink(this.auth, email, window.location.href));
  }

  // doIsSignInWithEmailLink = (location) =>
  //   this.auth.isSignInWithEmailLink(location);
  getIsSignInWithEmailLink(): boolean {
    return isSignInWithEmailLink(this.auth, window.location.href)
  }

}