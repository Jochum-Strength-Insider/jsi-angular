import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

import { Injectable } from '@angular/core';
import { LoginRequestModel } from '../models/auth/login-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  login({ email, password }: LoginRequestModel) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register({ email, password }: LoginRequestModel) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  doSignInWithEmailAndPassword(request: LoginRequestModel){
    console.log('login', request);
  }
}