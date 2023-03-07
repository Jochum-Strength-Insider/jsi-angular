import { Injectable } from '@angular/core';
import { LoginRequestModel } from '../models/auth/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  doSignInWithEmailAndPassword(request: LoginRequestModel){
    console.log('login', request);
  }

}
