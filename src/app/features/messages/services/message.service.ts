import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Message } from '@app/@core/models/messages/message.model';
import { BehaviorSubject, Observable, defer, first, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesSub = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSub.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) { }

  // *** Message API ***

  userMessagesListRef(uid: string): AngularFireList<Message> {
    return this.db.list(`messages/${uid}`);
  }

  userMessageObjectRef(uid: string, mid: string): AngularFireObject<Message> {
    return this.db.object(`messages/${uid}/${mid}`);
  }

  getUserMessage(uid: string, mid: string):Observable<Message> {
    return <Observable<Message>>this.userMessageObjectRef(uid, mid)
    .valueChanges();
  }

  getUserMessages(uid: string): Observable<Message[]> {
    return <Observable<Message[]>>this.userMessagesListRef(uid)
    .valueChanges([], { idField: 'id' })
  }

  getUserMessagesWithLimit(uid: string, limit: number):Observable<Message[]> {
    const messageRef = this.db.list(
      `messages/${uid}`,
      ref => ref.orderByChild("createdAt").limitToLast(limit)
    )

    return <Observable<Message[]>>messageRef
      .valueChanges([], { idField: 'id' })
  }

  getFirstUserMessage(uid: string): Observable<Message | null>  {
    const messageRef = this.db.list(
      `messages/${uid}`,
      ref => ref.orderByChild("createdAt").limitToFirst(1)
    )

    return <Observable<Message | null>>messageRef
      .valueChanges([], { idField: 'id' })
      .pipe(
        first(),
        map(messages => messages.length > 0 ? messages[0] : null)
      )
  }

  addUserMessage(uid: string, message: Message): Observable<string | null> {
    return of(this.userMessagesListRef(uid).push(message).key);
  }

  removeUserMessage(uid: string, message: Message): Observable<any> {
    return defer( () => this.userMessageObjectRef(uid, message.id).remove());
  }

  public removeUserMessages(uid: string): Observable<void> {
    return defer( () => this.userMessagesListRef(uid).remove())
  }

  // *** AdminUnreadMessage API ***

  adminUnreadListRef(): AngularFireList<Message> {
    return this.db.list(`adminUnread`);
  }

  adminUnreadObjectRef(mid: string): AngularFireObject<Message> {
    return this.db.object(`adminUnread/${mid}`);
  }

  addAdminUnreadMessage(message: Message, mid: string | null = null): Observable<any> {
    if(mid){
      return defer( () => this.adminUnreadListRef().update(mid, message))
    } else {
      return  defer(() => this.adminUnreadListRef().push(message))
    }
  }

  getAdminUnreadMessages(): Observable<Message[]> {
    return this.adminUnreadListRef()
      .valueChanges([], { idField: 'id' })
  }

  removeAdminUnreadMessage(mid: string): Observable<void> {
    return defer(() => this.adminUnreadObjectRef(mid).remove())
  }

  clearAllAdminUnreadMessages(): Observable<void> {
    return defer(() => this.adminUnreadListRef().remove())
  }

  // *** Admin CurrentlyMessaging API ***

  adminCurrentlyMessagingObjectRef(): AngularFireObject<{uid: string}> {
    return this.db.object(`currentlyMessaging`);
  }

  setAdminCurrentlyMessaging(uid: string): Observable<any> {
    return defer( () => this.adminCurrentlyMessagingObjectRef().update({ uid }));
  }
 
  clearAdminCurrentlyMessaging(): Observable<any> {
    return defer( () => this.adminCurrentlyMessagingObjectRef().remove());
  }

  getAdminCurrentlyMessaging(): Observable<string | undefined> {
    return <Observable<string>>this.adminCurrentlyMessagingObjectRef()
      .valueChanges().pipe(map(messaging => messaging?.uid));
  }

  // *** Users CurrentlyMessaging API ***

  usersCurrentlyMessagingObjectRef(uid: string): AngularFireObject<{ messaging: boolean }> {
    return this.db.object(`usersCurrentlyMessaging/${uid}`);
  }
  
  addUserCurrentlyMessaging(uid: string): Observable<any> {
    return defer( () => this.usersCurrentlyMessagingObjectRef(uid).update({ messaging: true }));
  }

  removeUserCurrentlyMessaging(uid: string): Observable<any> {
    return defer( () => this.usersCurrentlyMessagingObjectRef(uid).remove());
  }

  getUserCurrentlyMessaging(uid: string): Observable<boolean> {
    return this.usersCurrentlyMessagingObjectRef(uid)
      .valueChanges()
      .pipe(map((user) => {
        if(user){
          return user.messaging
        } else {
          return false
        }
      }));
  }

}
  

