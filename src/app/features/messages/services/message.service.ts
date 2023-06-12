import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Message } from '@app/@core/models/messages/message.model';
import { BehaviorSubject, Observable, first, from, map, of } from 'rxjs';

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

  getFirtUserMessage(uid: string): Observable<Message | null>  {
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
    return from(this.userMessageObjectRef(uid, message.id).remove());
  }

  // *** AdminUnreadMessage API ***

  adminUnreadListRef(): AngularFireList<Message> {
    return this.db.list(`adminUnread`);
  }

  adminUnreadObjectRef(): AngularFireObject<Message> {
    return this.db.object(`adminUnread`);
  }

  addAdminUnreadMessage(messageKey: string, message: Message): Observable<any> {
    return from(this.adminUnreadObjectRef().update({ [messageKey]: message }))
  }

  // *** CurrentlyMessaging API ***

  currentlyMessagingObjectRef(): AngularFireObject<{uid: string}> {
    return this.db.object(`currentlyMessaging`);
  }

  setCurrentlyMessaging(uid: string): Observable<any> {
    return from(this.currentlyMessagingObjectRef().update({ uid }));
  }

  clearCurrentlyMessaging(): Observable<any> {
    return from(this.currentlyMessagingObjectRef().remove());
  }

  getCurrentlyMessaging(): Observable<string | undefined> {
    return <Observable<string>>this.currentlyMessagingObjectRef()
      .valueChanges().pipe(map(messaging => messaging?.uid));
  }
}
