import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { from, map, Observable, tap } from 'rxjs';
import { UserStatusModel } from '../models/auth/user-status.model';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

    // *** Info / Connected *** //

    // info = () => this.db.ref(".info/connected");
    info(): Observable<boolean> {
      return <Observable<boolean>>this.db.object(`.info/connected`)
        .valueChanges()
    }

    // *** Status / Online *** //
  
    // status = (uid) => this.db.ref(`status/${uid}`);
    getUserStatus(uid: string): Observable<UserStatusModel> {
      return <Observable<UserStatusModel>>this.db.object(`status/${uid}`)
        .valueChanges()
    }
  
    // connect = (uid) => this.db.ref(`status/${uid}`).update({ online: true });
    connectUser(userId: string): Observable<void> {
      const userRef = this.db.object(`status/${userId}`)
      return from(userRef.update({ "online": true }));
    }
  
    // disconnect = (uid) => this.db.ref(`status/${uid}`).update({ online: false });
    disconnectUser(userId: string): Observable<void> {
      const userRef = this.db.object(`status/${userId}`)
      return from(userRef.update({ "online": true }));
    }
}
