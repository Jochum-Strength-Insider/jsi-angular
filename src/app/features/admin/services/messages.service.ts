import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { mapKeyToObjectOperator, mapKeysToObjectArrayOperator } from '@app/@core/utilities/mappings.utilities';
import { Observable, defer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class adminUnreadService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  // *** Admin Unread API ***

  adminUnreadMessagesRef(): AngularFireList<Message> {
    return this.db.list('adminUnread');
  }

  adminUnreadMessageRef(mid: string): AngularFireObject<Message> {
    return this.db.object(`adminUnread/${mid}`);
  }

  // const messageObject = {
  //   text,
  //   userId: authUser.uid,
  //   username: authUser.username,
  //   createdAt: Number(moment().format("x")),
  // };

  // this.props.firebase.messages(this.props.roomId).push(messageObject)
  //   .then((snap) => {
  //     if (this.state.currentlyMessaging !== this.props.roomId) {
  //       const key = snap.key;
  //       this.props.firebase.adminUnreadMessages().update({ [key]: messageObject });
  //     }
  //   })

  addUnreadMessage(text: string, authUser: User, currentlyMessaging: string, roomId: string) {
    const messageObject = {
      text: text,
      userId: authUser.id,
      username: authUser.username,
      createdAt: new Date().valueOf(),
    };

    // this.messageService.addMessage(messageObject)
    //   .subscribe((snap: any) => {
    //     if (currentlyMessaging !== roomId) {
    //       const key = snap.key;
    //       this.adminUnreadMessageRef(key).update(messageObject);
    //     }
    //   })
  }

  getAdminUnreadMessages(): Observable<Message[]> {
    return this.adminUnreadMessagesRef()
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

  getAdminUnreadMessage(mid: string): Observable<Message> {
    return this.adminUnreadMessageRef(mid)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() )
  }

  clearAdminUnread(): Observable<void>{
    return defer( () => this.adminUnreadMessagesRef().remove());
  }

  currentlyMessagingObjectRef(): AngularFireObject<string> {
    return this.db.object('currentlyMessaging');
  }

  getCurrentlyMessaging(): Observable<string> {
    return this.currentlyMessagingObjectRef()
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() )
  }

  // // *** User Unread API ***

  // unreadMessages = uid => this.db.ref(`unread/${uid}`);
  getUnreadMessages(uid: string): Observable<Message[]> {
    return <Observable<Message[]>>this.db.list(`unread/${uid}`)
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() );
  }

}