import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { defer, Observable } from 'rxjs';
import { UserStatusModel } from '../models/auth/user-status.model';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

    // *** Info / Connected *** //

    info(): Observable<boolean> {
      return <Observable<boolean>>this.db.object(`.info/connected`)
        .valueChanges()
    }

    // *** Status / Online *** //
  
    getUserStatus(uid: string): Observable<UserStatusModel> {
      return <Observable<UserStatusModel>>this.db.object(`status/${uid}`)
        .valueChanges()
    }
  
    connectUser(userId: string): Observable<void> {
      const userRef = this.db.object(`status/${userId}`)
      return defer( () => userRef.update({ "online": true }));
    }
  
    disconnectUser(userId: string): Observable<void> {
      const userRef = this.db.object(`status/${userId}`)
      return defer( () => userRef.update({ "online": true }));
    }
}
